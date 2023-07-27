import { getModelToken } from '@nestjs/sequelize'
import addYears from 'date-fns/addYears'
import startOfDay from 'date-fns/startOfDay'
import faker from 'faker'
import { Model } from 'sequelize'

import {
  ApiScope,
  ApiScopeGroup,
  ApiScopeUser,
  ApiScopeUserAccess,
  Client,
  ClientAllowedScope,
  ClientClaim,
  ClientGrantType,
  ClientPostLogoutRedirectUri,
  ClientRedirectUri,
  ClientSecret,
  Delegation,
  DelegationScope,
  Domain,
  IdentityResource,
  Language,
  Translation,
} from '@island.is/auth-api-lib'
import { isDefined } from '@island.is/shared/utils'
import { createNationalId } from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { CreateApiScopeGroup } from './apiScopeGroup.fixture'
import {
  CreateClient,
  createClient as createClientFixture,
} from './client.fixture'
import { CreateDomain } from './domain.fixture'
import {
  CreateApiScope,
  CreateApiScopeUserAccess,
  CreateClientClaim,
  CreateClientGrantType,
  CreateClientUri,
  CreateCustomDelegation,
  CreateIdentityResource,
} from './types'

export class FixtureFactory {
  constructor(private app: TestApp) {}

  get<T extends new () => Model>(model: T): T {
    return this.app.get(getModelToken(model))
  }

  async createDomain({
    name,
    description,
    nationalId,
    apiScopes = [],
    organisationLogoKey,
  }: CreateDomain): Promise<Domain> {
    // Create the global identity resources as createDomain is always called first when test data is created.
    await Promise.all(
      ['openid', 'profile'].map((name) =>
        this.createIdentityResource({ name }),
      ),
    )

    const domain = await this.get(Domain).create({
      name: name ?? faker.random.word(),
      description: description ?? faker.lorem.sentence(),
      nationalId: nationalId ?? createNationalId('company'),
      organisationLogoKey: organisationLogoKey ?? faker.random.word(),
    })
    domain.scopes = await Promise.all(
      apiScopes.map((apiScope) =>
        this.createApiScope({ domainName: domain.name, ...apiScope }),
      ),
    )
    return domain
  }

  async createClient(client?: Partial<CreateClient>): Promise<Client> {
    const createdClient = await this.get(Client).create(
      createClientFixture(client),
    )

    createdClient.redirectUris = await Promise.all(
      client?.redirectUris
        ?.map((redirectUri) =>
          this.createClientRedirectUri({
            clientId: createdClient.clientId,
            uri: redirectUri,
          }),
        )
        .filter(isDefined) ?? [],
    )

    createdClient.postLogoutRedirectUris = await Promise.all(
      client?.postLogoutRedirectUris
        ?.map((redirectUri) =>
          this.createClientPostLogoutRedirectUri({
            clientId: createdClient.clientId,
            uri: redirectUri,
          }),
        )
        .filter(isDefined) ?? [],
    )

    createdClient.allowedGrantTypes = await Promise.all(
      client?.allowedGrantTypes
        ?.map((grantType) =>
          this.createClientGrantType({
            clientId: createdClient.clientId,
            grantType,
          }),
        )
        .filter(isDefined) ?? [],
    )

    createdClient.claims = await Promise.all(
      client?.claims
        ?.map((claim) =>
          this.createClientClaim({
            clientId: createdClient.clientId,
            type: claim.type,
            value: claim.value,
          }),
        )
        .filter(isDefined) ?? [],
    )

    createdClient.allowedScopes = (
      await Promise.all(
        client?.allowedScopes?.map((allowedScope) =>
          this.createClientAllowedScope(allowedScope),
        ) ?? [],
      )
    ).map(
      ({ scopeName, clientId }) =>
        ({
          scopeName,
          clientId,
        } as ClientAllowedScope),
    )

    return createdClient
  }

  async createClientAllowedScope(
    scope: Partial<ClientAllowedScope>,
  ): Promise<ClientAllowedScope> {
    return this.get(ClientAllowedScope).create(scope)
  }

  async createIdentityResource(
    createIdentityResource: CreateIdentityResource = {},
  ): Promise<IdentityResource> {
    const [identityResource, _] = await this.get(IdentityResource).upsert({
      enabled: createIdentityResource.enabled ?? true,
      name: createIdentityResource.name ?? faker.random.word(),
      displayName: createIdentityResource.displayName ?? faker.random.word(),
      description: createIdentityResource.description ?? faker.random.word(),
      showInDiscoveryDocument:
        createIdentityResource.showInDiscoveryDocument ?? true,
      required: createIdentityResource.required ?? false,
      emphasize: createIdentityResource.emphasize ?? false,
      automaticDelegationGrant:
        createIdentityResource.automaticDelegationGrant ?? false,
    })

    return identityResource
  }

  async createClientRedirectUri({
    clientId,
    uri,
  }: CreateClientUri): Promise<ClientRedirectUri> {
    return this.get(ClientRedirectUri).create({
      clientId,
      redirectUri: uri ?? faker.internet.url(),
    })
  }

  async createClientPostLogoutRedirectUri({
    clientId,
    uri,
  }: CreateClientUri): Promise<ClientPostLogoutRedirectUri> {
    return this.get(ClientPostLogoutRedirectUri).create({
      clientId,
      redirectUri: uri ?? faker.internet.url(),
    })
  }

  async createClientClaim({
    clientId,
    type,
    value,
  }: CreateClientClaim): Promise<ClientClaim> {
    return this.get(ClientClaim).create({
      clientId,
      type: type ?? faker.random.word(),
      value: value ?? faker.random.word(),
    })
  }

  async createClientGrantType({
    clientId,
    grantType,
  }: CreateClientGrantType): Promise<ClientGrantType> {
    return this.get(ClientGrantType).create({
      clientId,
      grantType: grantType ?? faker.random.word(),
    })
  }

  async createSecret(secret: Partial<ClientSecret>): Promise<ClientSecret> {
    return this.get(ClientSecret).create(secret)
  }

  async createApiScope({
    domainName,
    ...apiScope
  }: CreateApiScope = {}): Promise<ApiScope> {
    if (!domainName) {
      domainName = (await this.createDomain({ name: faker.random.word() })).name
    }
    return this.get(ApiScope).create({
      enabled: apiScope.enabled ?? true,
      name: apiScope.name ?? faker.random.word(),
      displayName: apiScope.displayName ?? faker.random.word(),
      description: apiScope.description ?? faker.random.word(),
      order: apiScope.order ?? 0,
      showInDiscoveryDocument: apiScope.showInDiscoveryDocument ?? true,
      required: apiScope.required ?? false,
      emphasize: apiScope.emphasize ?? false,
      grantToAuthenticatedUser: apiScope.grantToAuthenticatedUser ?? true,
      grantToLegalGuardians: apiScope.grantToLegalGuardians ?? false,
      grantToProcuringHolders: apiScope.grantToProcuringHolders ?? false,
      allowExplicitDelegationGrant:
        apiScope.allowExplicitDelegationGrant ?? false,
      automaticDelegationGrant: apiScope.automaticDelegationGrant ?? false,
      alsoForDelegatedUser: apiScope.alsoForDelegatedUser ?? false,
      grantToPersonalRepresentatives:
        apiScope.grantToPersonalRepresentatives ?? false,
      isAccessControlled: apiScope.isAccessControlled ?? false,
      groupId: apiScope.groupId,
      domainName,
    })
  }

  async createApiScopeGroup({
    apiScopes = [],
    domainName,
    ...data
  }: CreateApiScopeGroup = {}): Promise<ApiScopeGroup> {
    if (!domainName) {
      domainName = (await this.createDomain({ name: faker.random.word() })).name
    }
    const group = await this.get(ApiScopeGroup).create({
      id: data.id ?? faker.datatype.uuid(),
      name: data.name ?? faker.random.word(),
      displayName: data.displayName ?? faker.random.word(),
      description: data.description ?? faker.random.word(),
      order: data.order ?? 0,
      domainName,
    })
    await Promise.all(
      apiScopes.map((apiScope) =>
        this.createApiScope({
          domainName: domainName,
          groupId: group.id,
          ...apiScope,
        }),
      ),
    )
    return group
  }

  async createApiScopeUserAccess({
    nationalId,
    scope,
  }: CreateApiScopeUserAccess): Promise<ApiScopeUserAccess> {
    await this.get(ApiScopeUser).upsert({
      nationalId,
      email: faker.internet.email(),
    })
    return this.get(ApiScopeUserAccess).create({
      nationalId,
      scope,
    })
  }

  async createCustomDelegation({
    fromNationalId,
    toNationalId,
    domainName,
    fromName,
    scopes = [],
  }: CreateCustomDelegation): Promise<Delegation> {
    const delegation = await this.get(Delegation).create({
      id: faker.datatype.uuid(),
      fromNationalId: fromNationalId ?? createNationalId(),
      toNationalId: toNationalId ?? createNationalId('person'),
      domainName,
      fromDisplayName: fromName ?? faker.name.findName(),
      toName: faker.name.findName(),
    })

    delegation.delegationScopes = await Promise.all(
      scopes.map(({ scopeName, validFrom, validTo }) =>
        this.get(DelegationScope).create({
          id: faker.datatype.uuid(),
          delegationId: delegation.id,
          scopeName,
          validFrom: validFrom ?? startOfDay(new Date()),
          validTo: validTo ?? addYears(new Date(), 1),
        }),
      ),
    )

    delegation.delegationScopes = await this.get(DelegationScope).findAll({
      where: { delegationId: delegation.id },
      include: [ApiScope],
    })

    return delegation
  }

  async createTranslations(
    instance: Model,
    language: string,
    translations: Record<string, string>,
  ): Promise<Translation[]> {
    const className = instance.constructor.name.toLowerCase()
    const key = instance.get(
      (instance.constructor as typeof Model).primaryKeyAttributes[0],
    ) as string
    const translationObjs = Object.entries(translations).map(
      ([property, value]) => ({
        language,
        className,
        key,
        property,
        value,
      }),
    )

    await this.get(Language).upsert({
      isoKey: language,
      description: 'Lang description',
      englishDescription: 'Lang en description',
    })
    return this.get(Translation).bulkCreate(translationObjs)
  }
}

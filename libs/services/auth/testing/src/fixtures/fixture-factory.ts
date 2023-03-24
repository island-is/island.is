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
  Delegation,
  DelegationScope,
  Domain,
  IdentityResource,
  Translation,
} from '@island.is/auth-api-lib'
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
    return this.get(Client).create(createClientFixture(client))
  }

  async createClientAllowedScope(
    scope: Partial<ClientAllowedScope>,
  ): Promise<ClientAllowedScope> {
    return this.get(ClientAllowedScope).create(scope)
  }

  async createIdentityResource(
    identityResource: CreateIdentityResource = {},
  ): Promise<IdentityResource> {
    return this.get(IdentityResource).create({
      enabled: identityResource.enabled ?? true,
      name: identityResource.name ?? faker.random.word(),
      displayName: identityResource.displayName ?? faker.random.word(),
      description: identityResource.description ?? faker.random.word(),
      showInDiscoveryDocument: identityResource.showInDiscoveryDocument ?? true,
      required: identityResource.required ?? false,
      emphasize: identityResource.emphasize ?? false,
      automaticDelegationGrant:
        identityResource.automaticDelegationGrant ?? false,
    })
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

    return this.get(Translation).bulkCreate(translationObjs)
  }
}

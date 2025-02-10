import { getModelToken } from '@nestjs/sequelize'
import addYears from 'date-fns/addYears'
import startOfDay from 'date-fns/startOfDay'
import faker from 'faker'
import { Model } from 'sequelize'

import {
  ApiScope,
  ApiScopeDelegationType,
  ApiScopeGroup,
  ApiScopeUser,
  ApiScopeUserAccess,
  Claim,
  Client,
  ClientAllowedScope,
  ClientClaim,
  ClientDelegationType,
  ClientGrantType,
  ClientPostLogoutRedirectUri,
  ClientRedirectUri,
  ClientSecret,
  Delegation,
  DelegationIndex,
  DelegationProviderModel,
  DelegationScope,
  DelegationTypeModel,
  Domain,
  IdentityResource,
  Language,
  PersonalRepresentative,
  PersonalRepresentativeDelegationTypeModel,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeScopePermission,
  PersonalRepresentativeType,
  Translation,
  UserIdentity,
} from '@island.is/auth-api-lib'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
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
  CreateClaim,
  CreateClientClaim,
  CreateClientGrantType,
  CreateClientUri,
  CreateCustomDelegation,
  CreateCustomDelegationScope,
  CreateDelegationIndexRecord,
  CreateDelegationProvider,
  CreateDelegationType,
  CreateIdentityResource,
  CreatePersonalRepresentativeDelegation,
  CreatePersonalRepresentativeRightType,
  CreatePersonalRepresentativeScopePermission,
  CreateUserIdentity,
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
      apiScopes.map((apiScope, order) =>
        this.createApiScope({
          domainName: domain.name,
          order,
          ...apiScope,
        }),
      ),
    )
    return domain
  }

  async createClient(client?: Partial<CreateClient>): Promise<Client> {
    const createdClient = await this.get(Client).create(
      createClientFixture(client),
    )

    if (client?.supportedDelegationTypes) {
      createdClient.supportedDelegationTypes = await Promise.all(
        client.supportedDelegationTypes.map(async (id) => {
          const type = await this.createDelegationType({
            id,
            providerId: this.getProvider(id),
          })

          return this.get(ClientDelegationType).create({
            clientId: createdClient.clientId,
            delegationType: type.id,
          })
        }),
      )
    }

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
    const createdScope = await this.get(ApiScope).create({
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

    if (apiScope?.supportedDelegationTypes) {
      createdScope.supportedDelegationTypes = await Promise.all(
        apiScope.supportedDelegationTypes.map(async (id) => {
          const type = await this.createDelegationType({
            id,
            providerId: this.getProvider(id),
          })

          return this.get(ApiScopeDelegationType).create({
            apiScopeName: createdScope.name,
            delegationType: type.id,
          })
        }),
      )
    }

    return createdScope
  }

  getProvider = (delegationType: string): string => {
    switch (delegationType) {
      case AuthDelegationType.Custom:
        return AuthDelegationProvider.Custom
      case AuthDelegationType.LegalGuardian:
      case AuthDelegationType.LegalGuardianMinor:
        return AuthDelegationProvider.NationalRegistry
      case AuthDelegationType.ProcurationHolder:
        return AuthDelegationProvider.CompanyRegistry
      case AuthDelegationType.PersonalRepresentative:
        return AuthDelegationProvider.PersonalRepresentativeRegistry
      case AuthDelegationType.LegalRepresentative:
        return AuthDelegationProvider.DistrictCommissionersRegistry
      default:
        return ''
    }
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
    referenceId,
  }: CreateCustomDelegation): Promise<Delegation> {
    const delegation = await this.get(Delegation).create({
      id: faker.datatype.uuid(),
      fromNationalId: fromNationalId ?? createNationalId(),
      toNationalId: toNationalId ?? createNationalId('person'),
      domainName,
      fromDisplayName: fromName ?? faker.name.findName(),
      toName: faker.name.findName(),
      referenceId: referenceId ?? undefined,
    })

    delegation.delegationScopes = await Promise.all(
      scopes.map(({ scopeName, validFrom, validTo }) =>
        this.createCustomScope({
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

  async createCustomScope({
    scopeName,
    validFrom,
    validTo,
    delegationId,
  }: CreateCustomDelegationScope & {
    delegationId: string
  }): Promise<DelegationScope> {
    const scope = await this.get(DelegationScope).create({
      id: faker.datatype.uuid(),
      delegationId,
      scopeName,
      validFrom: validFrom ?? startOfDay(new Date()),
      validTo: validTo ?? addYears(new Date(), 1),
    })

    return scope
  }

  async createPersonalRepresentativeRightType(
    rightType?: CreatePersonalRepresentativeRightType,
  ) {
    const [personalRepresentativeRightType] = await this.get(
      PersonalRepresentativeRightType,
    ).findCreateFind({
      where: {
        code: rightType?.code ?? faker.random.word(),
      },
      defaults: {
        validFrom: rightType?.validFrom ?? startOfDay(new Date()),
        validTo: rightType?.validTo ?? addYears(new Date(), 1),
        description: rightType?.description ?? faker.random.words(3),
      },
    })

    return personalRepresentativeRightType
  }

  async createDelegationTypeForPersonalRepresentative(id: string) {
    // create DelegationProvider first to attach to the delegation Type
    const [delegationProvider] = await this.get(
      DelegationProviderModel,
    ).findCreateFind({
      where: { id: 'talsmannagrunnur' },
      defaults: {
        id: 'talsmannagrunnur',
        name: 'Talsmannagrunnur',
        description: 'Talsmannagrunnur',
        delegationTypes: [],
      },
    })

    const [delegationType] = await this.get(DelegationTypeModel).findCreateFind(
      {
        where: { id },
        defaults: {
          id: `PersonalRepresentative:${id}`,
          name: `Personal Representative: ${id}`,
          providerId: delegationProvider.id,
          provider: delegationProvider,
          description: `Personal representative delegation type for right type ${id}`,
        },
      },
    )

    return delegationType
  }

  async createPersonalRepresentativeRight({
    rightTypeCode,
    personalRepresentativeId,
    id,
  }: {
    rightTypeCode: string
    personalRepresentativeId: string
    id?: string | null
  }) {
    return this.get(PersonalRepresentativeRight).create({
      id: id ?? faker.datatype.uuid(),
      personalRepresentativeId,
      rightTypeCode,
    })
  }

  async createPersonalRepresentativeDelegationType({
    delegationTypeCode,
    personalRepresentativeId,
    id,
  }: {
    delegationTypeCode: string
    personalRepresentativeId: string
    id?: string | null
  }) {
    return this.get(PersonalRepresentativeDelegationTypeModel).create({
      id: id ?? faker.datatype.uuid(),
      personalRepresentativeId: personalRepresentativeId,
      delegationTypeId: delegationTypeCode,
    })
  }

  async createPersonalRepresentativeScopePermission({
    rightTypeCode,
    apiScopeName,
  }: CreatePersonalRepresentativeScopePermission) {
    // need to create the right type first because of foreign key constraint
    await this.createPersonalRepresentativeRightType({ code: rightTypeCode })

    return this.get(PersonalRepresentativeScopePermission).findCreateFind({
      where: {
        rightTypeCode,
        apiScopeName,
      },
      defaults: {
        rightTypeCode,
        apiScopeName,
      },
    })
  }

  async createPersonalRepresentativeDelegation({
    toNationalId,
    fromNationalId,
    validTo,
    type,
    rightTypes,
  }: CreatePersonalRepresentativeDelegation) {
    const [personalRepresentativeType] = await this.get(
      PersonalRepresentativeType,
    ).findCreateFind({
      where: { code: type?.code ?? faker.random.word() },
      defaults: {
        validTo: type?.validTo ?? addYears(new Date(), 1),
        name: type?.name ?? faker.random.word(),
        description: type?.description ?? faker.random.words(3),
      },
    })

    const personalRepresentative = await this.get(
      PersonalRepresentative,
    ).create({
      id: faker.datatype.uuid(),
      nationalIdRepresentedPerson: fromNationalId ?? createNationalId(),
      nationalIdPersonalRepresentative:
        toNationalId ?? createNationalId('person'),
      validTo: validTo ?? addYears(new Date(), 1),
      personalRepresentativeTypeCode: personalRepresentativeType.code,
      contractId: 'data_for_tests',
      externalUserId: 'data_for_tests',
    })

    const personalRepresentativeRightTypes = await Promise.all(
      rightTypes
        ? rightTypes.map((rightType) =>
            this.createPersonalRepresentativeRightType(rightType),
          )
        : [this.createPersonalRepresentativeRightType()],
    )

    const delegationTypes = await Promise.all(
      rightTypes
        ? rightTypes.map((rightType) =>
            this.createDelegationType({ id: rightType?.code ?? '' }),
          )
        : [],
    )

    await Promise.all(
      delegationTypes.map((delegationType) => {
        this.createPersonalRepresentativeDelegationType({
          id: personalRepresentative.id,
          personalRepresentativeId: personalRepresentative.id,
          delegationTypeCode: delegationType.id,
        })
      }),
    )

    await Promise.all(
      personalRepresentativeRightTypes.map(
        (personalRepresentativeRightType) => {
          this.createPersonalRepresentativeRight({
            id: personalRepresentative.id,
            personalRepresentativeId: personalRepresentative.id,
            rightTypeCode: personalRepresentativeRightType.code,
          })
        },
      ),
    )

    return personalRepresentative
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

  async createDelegationIndexRecord({
    fromNationalId,
    toNationalId,
    provider,
    type,
    customDelegationScopes,
    validTo,
    subjectId,
  }: CreateDelegationIndexRecord) {
    return this.get(DelegationIndex).create({
      fromNationalId: fromNationalId ?? createNationalId(),
      toNationalId: toNationalId ?? createNationalId('person'),
      provider: provider ?? AuthDelegationProvider.Custom,
      type: type ?? AuthDelegationType.Custom,
      customDelegationScopes,
      validTo,
      subjectId,
    })
  }

  async createUserIdentity({
    providerName = faker.random.word(),
    providerSubjectId = faker.datatype.uuid(),
    subjectId = faker.datatype.uuid(),
    active = true,
    name = faker.name.findName(),
  }: CreateUserIdentity) {
    return this.get(UserIdentity).create({
      providerName,
      providerSubjectId,
      subjectId,
      active,
      name,
    })
  }

  async createClaim({
    type = faker.random.word(),
    value = faker.random.word(),
    subjectId = faker.datatype.uuid(),
    valueType = faker.random.word(),
    issuer = faker.random.word(),
    originalIssuer = faker.random.word(),
  }: CreateClaim) {
    return this.get(Claim).create({
      type,
      value,
      subjectId,
      valueType,
      issuer,
      originalIssuer,
    })
  }

  async createDelegationProvider({
    id = faker.random.word(),
    name = faker.random.word(),
    description = faker.random.words(3),
  }: CreateDelegationProvider) {
    const [provider] = await this.get(DelegationProviderModel).findCreateFind({
      where: { id },
      defaults: { id, name, description, delegationTypes: [] },
    })

    return provider
  }

  async createDelegationType({
    id = faker.random.word(),
    name = faker.random.word(),
    description = faker.random.words(3),
    providerId,
  }: CreateDelegationType) {
    const delegationProvider = await this.createDelegationProvider({
      id: providerId,
    })

    const [delegationType] = await this.get(DelegationTypeModel).findCreateFind(
      {
        where: { id },
        defaults: {
          id,
          name,
          description,
          providerId: delegationProvider.id,
          provider: delegationProvider,
        },
      },
    )

    return delegationType
  }
}

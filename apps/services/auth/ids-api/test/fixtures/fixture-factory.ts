import faker from 'faker'
import addYears from 'date-fns/addYears'
import { getModelToken } from '@nestjs/sequelize'
import { Model } from 'sequelize'

import { TestApp } from '@island.is/testing/nest'
import { createNationalId } from '@island.is/testing/fixtures'
import {
  ApiScope,
  ApiScopeUser,
  ApiScopeUserAccess,
  Client,
  ClientAllowedScope,
  Delegation,
  DelegationScope,
  Domain,
} from '@island.is/auth-api-lib'
import {
  CreateApiScope,
  CreateApiScopeUserAccess,
  CreateCustomDelegation,
  CreateDomain,
} from './types'
import startOfDay from 'date-fns/startOfDay'
import { CreateClient } from '@island.is/services/auth/testing'

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
  }: CreateDomain = {}): Promise<Domain> {
    const domain = await this.get(Domain).create({
      name: name ?? faker.random.word(),
      description: description ?? faker.lorem.sentence(),
      nationalId: nationalId ?? createNationalId('company'),
    })
    domain.scopes = await Promise.all(
      apiScopes.map((apiScope) =>
        this.createApiScope({ domainName: domain.name, ...apiScope }),
      ),
    )
    return domain
  }

  async createClient(client: CreateClient): Promise<Client> {
    return this.get(Client).create(client)
  }

  async createClientAllowedScope(
    scope: Partial<ClientAllowedScope>,
  ): Promise<ClientAllowedScope> {
    return this.get(ClientAllowedScope).create(scope)
  }

  async createApiScope({
    domainName,
    ...apiScope
  }: CreateApiScope = {}): Promise<ApiScope> {
    if (!domainName) {
      domainName = (await this.createDomain()).name
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
}

import { Injectable } from '@nestjs/common'
import groupBy from 'lodash/groupBy'

import { User } from '@island.is/auth-nest-tools'

import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { CreateScopeInput } from './dto/create-scope.input'
import { CreateScopeResponse } from './dto/create-scope.response'
import { CreateScopeUserInput } from './dto/create-scope-user.input'
import { UpdateScopeUsersInput } from './dto/update-scope-users.input'
import { ScopeInput } from './dto/scope.input'
import { Scope } from './models/scope.model'
import { ScopeClient } from './models/scope-client.model'
import { ScopeUser } from './models/scope-user.model'
import { ScopesPayload } from './dto/scopes.payload'
import { ScopesByTenantsPayload } from './dto/scopes-by-tenants.payload'
import { ScopeEnvironment } from './models/scope-environment.model'
import { environments } from '../shared/constants/environments'
import { AdminPatchScopeInput } from './dto/patch-scope.input'
import { PublishScopeInput } from './dto/publish-scope.input'

const SCOPES_BY_TENANTS_FETCH_LIMIT = 100

@Injectable()
export class ScopeService extends MultiEnvironmentService {
  /**
   * Creates a scope for a specific tenant for the given environments
   */
  async createScope(
    user: User,
    input: CreateScopeInput,
  ): Promise<CreateScopeResponse[]> {
    const createdSettledPromises = await Promise.allSettled(
      input.environments.map(async (environment) => {
        return this.makeRequest(user, environment, (api) =>
          api.meScopesControllerCreateRaw({
            tenantId: input.tenantId,
            adminCreateScopeDto: {
              name: input.name,
              displayName: [
                {
                  value: input.displayName,
                  locale: 'is',
                },
              ],
              description: [
                {
                  value: input.description,
                  locale: 'is',
                },
              ],
            },
          }),
        )
      }),
    )

    return this.handleSettledPromises(createdSettledPromises, {
      mapper: (scope, index) => ({
        scopeName: scope.name,
        environment: input.environments[index],
      }),
      prefixErrorMessage: `Failed to create scope ${input.name}`,
    })
  }

  /**
   * Updates a scope for a specific tenant for the given environments
   */
  async updateScope({
    user,
    input: { environments, scopeName, tenantId, ...adminPatchScopeDto },
  }: {
    user: User
    input: AdminPatchScopeInput
  }): Promise<ScopeEnvironment[]> {
    if (Object.keys(adminPatchScopeDto).length === 0) {
      throw new Error('Nothing provided to update')
    }

    const updatedSettledPromises = await Promise.allSettled(
      environments.map(async (environment) => {
        return this.makeRequest(user, environment, (api) =>
          api.meScopesControllerUpdateRaw({
            tenantId,
            scopeName,
            adminPatchScopeDto,
          }),
        )
      }),
    )

    return this.handleSettledPromises(updatedSettledPromises, {
      mapper: (scope, index) => ({
        ...scope,
        scopeName: scope.name,
        environment: environments[index],
        categoryIds: scope.categoryIds ?? [],
        tagIds: scope.tagIds ?? [],
      }),
      prefixErrorMessage: `Failed to update scope ${scopeName}`,
    })
  }

  /**
   * Publishes a scope to a specific environment.
   * First fetches the scope from the source environment.
   * Then creates the scope in the target environment.
   */
  async publishScope(
    user: User,
    { sourceEnvironment, targetEnvironment, ...input }: PublishScopeInput,
  ): Promise<ScopeEnvironment> {
    // Fetch the scope from source environment
    const sourceInput = await this.makeRequest(
      user,
      sourceEnvironment,
      (sourceApi) =>
        sourceApi.meScopesControllerFindByTenantIdAndScopeNameRaw({
          tenantId: input.tenantId,
          scopeName: input.scopeName,
        }),
    )

    if (!sourceInput) {
      throw new Error(
        `Scope ${input.scopeName} not found in ${sourceEnvironment}`,
      )
    }

    // If the source scope environment exists then create replica environment in the target environment.
    const newScope = await this.makeRequest(
      user,
      targetEnvironment,
      (targetApi) =>
        targetApi.meScopesControllerCreateRaw({
          tenantId: input.tenantId,
          adminCreateScopeDto: sourceInput,
        }),
    )

    if (!newScope) {
      throw new Error(
        `Failed to create scope ${input.scopeName} on ${targetEnvironment}`,
      )
    }

    return {
      ...newScope,
      environment: targetEnvironment,
      categoryIds: newScope.categoryIds ?? [],
      tagIds: newScope.tagIds ?? [],
    }
  }

  /**
   * Gets all scopes for all available environments for a specific tenant
   */
  async getScopes(user: User, tenantId: string): Promise<ScopesPayload> {
    const scopesSettledPromises = await Promise.allSettled(
      environments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meScopesControllerFindAllByTenantIdRaw({
            tenantId,
          }),
        ),
      ),
    )

    const scopeEnvironments = this.handleSettledPromises(
      scopesSettledPromises,
      {
        mapper: (scopes, index) =>
          scopes.map(
            (scope) =>
              ({
                ...scope,
                environment: environments[index],
                categoryIds: scope.categoryIds ?? [],
                tagIds: scope.tagIds ?? [],
              } as ScopeEnvironment),
          ),
        prefixErrorMessage: `Failed to get scopes by tenantId ${tenantId}`,
      },
    ).flat()

    const groupedScopes = groupBy(scopeEnvironments, 'name')

    const scopeModels: Scope[] = Object.entries(groupedScopes)
      .map(([scopeName, scopes]) => ({
        scopeName,
        modified: scopes[0].modified,
        environments: scopes,
      }))
      .sort((a, b) => a.scopeName.localeCompare(b.scopeName))

    return {
      data: scopeModels,
      totalCount: scopeModels.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  /**
   * Gets all scopes for the given tenants in a single fan-out.
   */
  async getScopesByTenants(
    user: User,
    tenantIds: string[],
  ): Promise<ScopesByTenantsPayload> {
    const uniqueIds = Array.from(new Set(tenantIds))

    const limitedIds = uniqueIds.slice(0, SCOPES_BY_TENANTS_FETCH_LIMIT)
    if (limitedIds.length < uniqueIds.length) {
      this.logger.warn(
        `getScopesByTenants truncated request from ${uniqueIds.length} to ${SCOPES_BY_TENANTS_FETCH_LIMIT} tenants`,
      )
    }

    const settled = await Promise.allSettled(
      limitedIds.map(async (tenantId) => ({
        tenantId,
        payload: await this.getScopes(user, tenantId),
      })),
    )

    const data = settled.flatMap((result, index) => {
      if (result.status === 'fulfilled') {
        return [
          { tenantId: result.value.tenantId, data: result.value.payload.data },
        ]
      }
      this.logger.error(`Failed to get scopes for tenant ${limitedIds[index]}`)
      return []
    })

    return { data }
  }

  /**
   * Gets a specific scope by scope name for all available environments
   */
  async getScope(user: User, input: ScopeInput): Promise<Scope | null> {
    const scopeSettledPromises = await Promise.allSettled(
      environments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meScopesControllerFindByTenantIdAndScopeNameRaw(input),
        ),
      ),
    )

    const environmentsScopes = this.handleSettledPromises(
      scopeSettledPromises,
      {
        mapper: (scope, index) => ({
          ...scope,
          environment: environments[index],
          categoryIds: scope.categoryIds ?? [],
          tagIds: scope.tagIds ?? [],
        }),
        prefixErrorMessage: `Failed to get scope ${input.scopeName}`,
      },
    )

    if (environmentsScopes.length === 0) return null

    return {
      scopeName: input.scopeName,
      modified: environmentsScopes[0].modified,
      environments: environmentsScopes,
    }
  }

  async getScopeClients(
    user: User,
    input: ScopeInput,
    environment: Environment,
  ): Promise<ScopeClient[]> {
    const clients = await this.makeRequest(user, environment, (api) =>
      api.meScopeClientsControllerFindAllRaw({
        tenantId: input.tenantId,
        scopeName: input.scopeName,
      }),
    )

    return (clients ?? []).map((client) => ({
      clientId: client.clientId,
      clientType: client.clientType,
      displayName: client.displayName,
    }))
  }

  /**
   * Gets all users with access to a specific scope in a given environment
   */
  async getScopeUsers(
    user: User,
    tenantId: string,
    scopeName: string,
    environment: Environment,
  ): Promise<ScopeUser[]> {
    const result = await this.makeRequest(user, environment, (api) =>
      api.meScopeUsersControllerFindUsersByScopeRaw({
        tenantId,
        scopeName,
      }),
    )

    return (result ?? []).map((u) => ({
      nationalId: u.nationalId,
      name: u.name ?? undefined,
      email: u.email,
    }))
  }

  /**
   * Creates a new user with access to a specific scope in the given environments
   */
  async createScopeUser(
    user: User,
    input: CreateScopeUserInput,
  ): Promise<ScopeUser> {
    let createdUser: ScopeUser | null = null

    for (const environment of input.environments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meScopeUsersControllerCreateRaw({
            tenantId: input.tenantId,
            scopeName: input.scopeName,
            apiScopeUserDTO: {
              nationalId: input.nationalId,
              name: input.name,
              email: input.email,
            },
          }),
        )

        if (result && !createdUser) {
          createdUser = {
            nationalId: result.nationalId,
            name: result.name ?? undefined,
            email: result.email,
          }
        }
      } catch (error) {
        this.logger.error(
          `Failed to create scope user in ${environment}`,
          error as Error,
        )
      }
    }

    if (!createdUser) {
      throw new Error('Failed to create scope user')
    }

    return createdUser
  }

  /**
   * Updates the user access list for a scope by adding/removing users
   */
  async updateScopeUsers(
    user: User,
    input: UpdateScopeUsersInput,
  ): Promise<boolean> {
    const targetEnvironments = input.environments
    let anySuccess = false

    for (const environment of targetEnvironments) {
      try {
        await this.makeRequest(user, environment, (api) =>
          api.meScopeUsersControllerUpdateScopeUsersRaw({
            tenantId: input.tenantId,
            scopeName: input.scopeName,
            updateScopeUsersDto: {
              addedNationalIds: input.addedNationalIds,
              removedNationalIds: input.removedNationalIds,
            },
          }),
        )
        anySuccess = true
      } catch (error) {
        this.logger.error(
          `Failed to update scope users in ${environment}`,
          error as Error,
        )
      }
    }

    return anySuccess
  }
}

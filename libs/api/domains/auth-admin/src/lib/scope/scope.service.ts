import { Injectable } from '@nestjs/common'
import groupBy from 'lodash/groupBy'

import { User } from '@island.is/auth-nest-tools'

import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { EnvironmentFailure } from '../shared/models/multi-environment-result.model'
import { CreateScopeInput } from './dto/create-scope.input'
import { CreateScopeResponse } from './dto/create-scope.response'
import { CreateScopeUserInput } from './dto/create-scope-user.input'
import { UpdateScopeUsersInput } from './dto/update-scope-users.input'
import { UpdateScopeClientsInput } from './dto/update-scope-clients.input'
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
import { PatchScopeResponse } from './models/patch-scope-response.model'
import { UpdateScopeUsersResponse } from './models/update-scope-users-response.model'
import { UpdateScopeClientsResponse } from './models/update-scope-clients-response.model'

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
   * Updates a scope for a specific tenant for the given environments.
   *
   * Per-environment failures are collected and returned alongside the
   * successful results.

   */
  async updateScope({
    user,
    input: {
      environments,
      scopeName,
      tenantId,
      categoryIds,
      tagIds,
      supportedDelegationTypes,
      ...adminPatchScopeDto
    },
  }: {
    user: User
    input: AdminPatchScopeInput
  }): Promise<PatchScopeResponse> {
    const hasAbsoluteCategoryIds = categoryIds !== undefined
    const hasAbsoluteTagIds = tagIds !== undefined
    const hasAbsoluteDelegationTypes = supportedDelegationTypes !== undefined
    const needsPerEnvDeltas =
      hasAbsoluteCategoryIds || hasAbsoluteTagIds || hasAbsoluteDelegationTypes

    if (Object.keys(adminPatchScopeDto).length === 0 && !needsPerEnvDeltas) {
      throw new Error('Nothing provided to update')
    }

    const updatedSettledPromises = await Promise.allSettled(
      environments.map(async (environment) => {
        const perEnvDeltas: {
          addedCategoryIds?: string[]
          removedCategoryIds?: string[]
          addedTagIds?: string[]
          removedTagIds?: string[]
          addedDelegationTypes?: string[]
          removedDelegationTypes?: string[]
        } = {}

        if (needsPerEnvDeltas) {
          const current = await this.makeRequest(user, environment, (api) =>
            api.meScopesControllerFindByTenantIdAndScopeNameRaw({
              tenantId,
              scopeName,
            }),
          )

          const currentCategoryIds = current?.categoryIds ?? []
          const currentTagIds = current?.tagIds ?? []
          const currentDelegationTypes = current?.supportedDelegationTypes ?? []

          if (hasAbsoluteCategoryIds) {
            const desired = categoryIds ?? []
            const added = desired.filter(
              (id) => !currentCategoryIds.includes(id),
            )
            const removed = currentCategoryIds.filter(
              (id) => !desired.includes(id),
            )
            if (added.length > 0) perEnvDeltas.addedCategoryIds = added
            if (removed.length > 0) perEnvDeltas.removedCategoryIds = removed
          }

          if (hasAbsoluteTagIds) {
            const desired = tagIds ?? []
            const added = desired.filter((id) => !currentTagIds.includes(id))
            const removed = currentTagIds.filter((id) => !desired.includes(id))
            if (added.length > 0) perEnvDeltas.addedTagIds = added
            if (removed.length > 0) perEnvDeltas.removedTagIds = removed
          }

          if (hasAbsoluteDelegationTypes) {
            const desired = supportedDelegationTypes ?? []
            const added = desired.filter(
              (id) => !currentDelegationTypes.includes(id),
            )
            const removed = currentDelegationTypes.filter(
              (id) => !desired.includes(id),
            )
            if (added.length > 0) perEnvDeltas.addedDelegationTypes = added
            if (removed.length > 0)
              perEnvDeltas.removedDelegationTypes = removed
          }
        }

        const dtoForEnv = { ...adminPatchScopeDto, ...perEnvDeltas }

        if (Object.keys(dtoForEnv).length === 0) {
          return this.makeRequest(user, environment, (api) =>
            api.meScopesControllerFindByTenantIdAndScopeNameRaw({
              tenantId,
              scopeName,
            }),
          )
        }

        return this.makeRequest(user, environment, (api) =>
          api.meScopesControllerUpdateRaw({
            tenantId,
            scopeName,
            adminPatchScopeDto: dtoForEnv,
          }),
        )
      }),
    )

    const { values, failures } = this.handleSettledPromisesWithFailures(
      updatedSettledPromises,
      environments,
      {
        mapper: (scope, index): ScopeEnvironment => ({
          ...scope,
          environment: environments[index],
          categoryIds: scope.categoryIds ?? [],
          tagIds: scope.tagIds ?? [],
        }),
        prefixErrorMessage: `Failed to update scope ${scopeName}`,
      },
    )

    return {
      environments: values,
      ...(failures.length > 0 && { failedEnvironments: failures }),
    }
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
   * Gets all scopes for a specific tenant. By default fans out across all
   * environments; pass `environment` to fan out to just that one.
   */
  async getScopes(
    user: User,
    tenantId: string,
    environment?: Environment,
  ): Promise<ScopesPayload> {
    const targetEnvironments = environment ? [environment] : environments

    const scopesSettledPromises = await Promise.allSettled(
      targetEnvironments.map((env) =>
        this.makeRequest(user, env, (api) =>
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
                environment: targetEnvironments[index],
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
   * Gets all scopes for the given tenants in a single fan-out. If
   * `environment` is provided, each per-tenant fetch is scoped to that env
   */
  async getScopesByTenants(
    user: User,
    tenantIds: string[],
    environment?: Environment,
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
        payload: await this.getScopes(user, tenantId, environment),
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
      tenantId: client.tenantId,
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
   * Updates the user access list for a scope by adding/removing users.
   *
   * Per-environment failures are collected and returned and
   * surfaced to the user.
   */
  async updateScopeUsers(
    user: User,
    input: UpdateScopeUsersInput,
  ): Promise<UpdateScopeUsersResponse> {
    const targetEnvironments = input.environments

    const settledPromises = await Promise.allSettled(
      targetEnvironments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meScopeUsersControllerUpdateScopeUsersRaw({
            tenantId: input.tenantId,
            scopeName: input.scopeName,
            updateScopeUsersDto: {
              addedNationalIds: input.addedNationalIds,
              removedNationalIds: input.removedNationalIds,
            },
          }),
        ),
      ),
    )

    const { values, failures } = this.handleSettledPromisesWithFailures(
      settledPromises,
      targetEnvironments,
      {
        mapper: (_value, index) => targetEnvironments[index],
        prefixErrorMessage: `Failed to update scope users for ${input.scopeName}`,
      },
    )

    return {
      ...(values.length > 0 && { environments: values }),
      ...(failures.length > 0 && { failedEnvironments: failures }),
    }
  }

  /**
   * Updates the client access list for a scope
   */
  async updateScopeClients(
    user: User,
    input: UpdateScopeClientsInput,
  ): Promise<UpdateScopeClientsResponse> {
    const { tenantId, scopeName, addedClientIds, removedClientIds } = input
    const targetEnvironments = input.environments

    const addedSet = new Set(addedClientIds)
    const dedupedRemovedIds = removedClientIds.filter((id) => !addedSet.has(id))

    const successfulEnvironments: Environment[] = []
    const failures: EnvironmentFailure[] = []

    const settledPromises = await Promise.allSettled(
      targetEnvironments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meScopeClientsControllerUpdateScopeClientsRaw({
            tenantId,
            scopeName,
            updateScopeClientsDto: {
              addedClientIds: Array.from(addedSet),
              removedClientIds: dedupedRemovedIds,
            },
          }),
        ),
      ),
    )

    settledPromises.forEach((result, index) => {
      const environment = targetEnvironments[index]

      if (result.status === 'rejected') {
        const message =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason ?? 'Unknown error')
        this.logger.error(
          `Failed to update scope clients for ${scopeName} in environment ${environment}`,
          result.reason,
        )
        failures.push({ environment, message })
        return
      }

      if (!this.isEnvironmentConfigured(environment)) {
        const message = `Failed to update scope clients for ${scopeName}: environment ${environment} not configured`
        this.logger.error(message)
        failures.push({ environment, message })
        return
      }

      successfulEnvironments.push(environment)
    })

    return {
      ...(successfulEnvironments.length > 0 && {
        environments: successfulEnvironments,
      }),
      ...(failures.length > 0 && { failedEnvironments: failures }),
    }
  }
}

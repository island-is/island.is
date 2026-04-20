import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { AdminApi } from '@island.is/clients/auth/admin-api'
import { ApiResponse } from '@island.is/clients/middlewares'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { environments } from '../shared/constants/environments'
import { ApiScopeUsersPayload } from './dto/api-scope-users.payload'
import { ApiScopeUsersInput } from './dto/api-scope-users.input'
import { CreateApiScopeUserInput } from './dto/create-api-scope-user.input'
import { UpdateApiScopeUserInput } from './dto/update-api-scope-user.input'
import { ApiScopeUser } from './models/api-scope-user.model'
import { ApiScopeUserEnvironmentData } from './models/api-scope-user-environment-data.model'
import { AccessControlledScope } from './models/access-controlled-scope.model'

interface ApiScopeUserAccessResponse {
  nationalId: string
  scope: string
}

interface ApiScopeUserResponse {
  nationalId: string
  name?: string | null
  email: string
  userAccess?: ApiScopeUserAccessResponse[]
}

interface PagedApiScopeUsersResponse {
  rows: ApiScopeUserResponse[]
  count: number
}

interface AccessControlledScopeResponse {
  name: string
  displayName?: string | null
  description?: string | null
}

/**
 * Typed wrapper for the generated AdminApi methods that will exist after
 * running the OpenAPI codegen for the auth admin API.
 */
interface ApiScopeUsersApi {
  meApiScopeUsersControllerFindAllAccessControlledScopesRaw(): Promise<
    ApiResponse<AccessControlledScopeResponse[]>
  >

  meApiScopeUsersControllerFindAndCountAllRaw(params: {
    searchString: string
    page: number
    count: number
  }): Promise<ApiResponse<PagedApiScopeUsersResponse>>

  meApiScopeUsersControllerFindOneRaw(params: {
    nationalId: string
  }): Promise<ApiResponse<ApiScopeUserResponse>>

  meApiScopeUsersControllerCreateRaw(params: {
    apiScopeUserDTO: {
      nationalId: string
      name: string
      email: string
      userAccess?: Array<{ nationalId: string; scope: string }>
    }
  }): Promise<ApiResponse<ApiScopeUserResponse>>

  meApiScopeUsersControllerUpdateRaw(params: {
    nationalId: string
    apiScopeUserUpdateDTO: {
      name?: string
      email?: string
      userAccess?: Array<{ nationalId: string; scope: string }>
    }
  }): Promise<ApiResponse<ApiScopeUserResponse>>

  meApiScopeUsersControllerDeleteRaw(params: {
    nationalId: string
  }): Promise<ApiResponse<number>>
}

@Injectable()
export class ApiScopeUserService extends MultiEnvironmentService {
  private typedRequest<T>(
    user: User,
    environment: typeof environments[number],
    request: (api: ApiScopeUsersApi) => Promise<ApiResponse<T>>,
  ) {
    return this.makeRequest(
      user,
      environment,
      request as unknown as (api: AdminApi) => Promise<ApiResponse<T>>,
    )
  }

  getAvailableEnvironments(): Environment[] {
    return this.getConfiguredEnvironments()
  }

  async getAccessControlledScopes(
    user: User,
    environment?: Environment,
  ): Promise<AccessControlledScope[]> {
    const targetEnvironments = environment ? [environment] : environments

    for (const env of targetEnvironments) {
      const result = await this.typedRequest(user, env, (api) =>
        api.meApiScopeUsersControllerFindAllAccessControlledScopesRaw(),
      )

      if (result) {
        return result.map((scope: AccessControlledScopeResponse) => ({
          name: scope.name,
          displayName: scope.displayName ?? undefined,
          description: scope.description ?? undefined,
        }))
      }
    }

    return []
  }

  async getApiScopeUser(
    user: User,
    nationalId: string,
  ): Promise<ApiScopeUser | null> {
    const availableEnvironments: Environment[] = []
    const environmentsData: ApiScopeUserEnvironmentData[] = []

    for (const environment of environments) {
      const result = await this.typedRequest(user, environment, (api) =>
        api.meApiScopeUsersControllerFindOneRaw({ nationalId }),
      )

      if (result) {
        availableEnvironments.push(environment)

        environmentsData.push({
          environment,
          nationalId: result.nationalId,
          name: result.name ?? undefined,
          email: result.email,
          userAccess: result.userAccess?.map((access) => ({
            nationalId: access.nationalId,
            scope: access.scope,
          })),
        })
      }
    }

    if (environmentsData.length === 0) {
      return null
    }

    return {
      nationalId,
      availableEnvironments,
      environments: environmentsData,
    }
  }

  async getApiScopeUsers(
    user: User,
    input: ApiScopeUsersInput,
  ): Promise<ApiScopeUsersPayload> {
    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        const result = await this.typedRequest(user, environment, (api) =>
          api.meApiScopeUsersControllerFindAndCountAllRaw({
            searchString: input.searchString ?? '',
            page: input.page,
            count: input.count,
          }),
        )
        return result ? { environment, data: result } : null
      }),
    )

    // Build a map of nationalId -> environments the user exists in
    const envMap = new Map<string, Environment[]>()
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { environment, data } = result.value
        for (const row of data.rows) {
          const existing = envMap.get(row.nationalId) ?? []
          existing.push(environment)
          envMap.set(row.nationalId, existing)
        }
      }
    }

    // Use the first successful environment as the primary result for pagination
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { data } = result.value
        return {
          rows: data.rows.map((row: ApiScopeUserResponse) => ({
            nationalId: row.nationalId,
            name: row.name ?? undefined,
            email: row.email,
            availableEnvironments: envMap.get(row.nationalId),
          })),
          totalCount: data.count,
        }
      }
    }

    return { rows: [], totalCount: 0 }
  }

  async createApiScopeUser(
    user: User,
    input: CreateApiScopeUserInput,
  ): Promise<ApiScopeUser> {
    const inputEnvironments = input.environments
    const targetEnvironments = inputEnvironments?.length
      ? environments.filter((env) => inputEnvironments.includes(env))
      : environments

    const availableEnvironments: Environment[] = []
    const environmentsData: ApiScopeUserEnvironmentData[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.typedRequest(user, environment, (api) =>
          api.meApiScopeUsersControllerCreateRaw({
            apiScopeUserDTO: {
              nationalId: input.nationalId,
              name: input.name,
              email: input.email,
              userAccess: input.userAccess?.map((access) => ({
                nationalId: access.nationalId,
                scope: access.scope,
              })),
            },
          }),
        )

        if (result) {
          availableEnvironments.push(environment)
          environmentsData.push({
            environment,
            nationalId: result.nationalId,
            name: result.name ?? undefined,
            email: result.email,
            userAccess: result.userAccess?.map((access) => ({
              nationalId: access.nationalId,
              scope: access.scope,
            })),
          })
        }
      } catch (error) {
        this.logger.error(
          `Failed to create API scope user in ${environment}`,
          error as Error,
        )
      }
    }

    if (environmentsData.length > 0) {
      return {
        nationalId: input.nationalId,
        availableEnvironments,
        environments: environmentsData,
      }
    }

    throw new Error('Failed to create API scope user')
  }

  async updateApiScopeUser(
    user: User,
    input: UpdateApiScopeUserInput,
  ): Promise<ApiScopeUser> {
    const targetEnvironments = input.environments

    if (!targetEnvironments) {
      const existing = await this.getApiScopeUser(user, input.nationalId)
      if (!existing) {
        throw new Error('API scope user not found')
      }
      return existing
    }

    const availableEnvironments: Environment[] = []
    const environmentsData: ApiScopeUserEnvironmentData[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.typedRequest(user, environment, (api) =>
          api.meApiScopeUsersControllerUpdateRaw({
            nationalId: input.nationalId,
            apiScopeUserUpdateDTO: {
              name: input.name ?? undefined,
              email: input.email ?? undefined,
              userAccess: input.userAccess?.map((access) => ({
                nationalId: access.nationalId,
                scope: access.scope,
              })),
            },
          }),
        )

        if (result) {
          availableEnvironments.push(environment)
          environmentsData.push({
            environment,
            nationalId: result.nationalId,
            name: result.name ?? undefined,
            email: result.email,
            userAccess: result.userAccess?.map((access) => ({
              nationalId: access.nationalId,
              scope: access.scope,
            })),
          })
        }
      } catch (error) {
        this.logger.error(
          `Failed to update API scope user in ${environment}`,
          error as Error,
        )
      }
    }

    if (environmentsData.length > 0) {
      return {
        nationalId: input.nationalId,
        availableEnvironments,
        environments: environmentsData,
      }
    }

    throw new Error('Failed to update API scope user')
  }

  async deleteApiScopeUser(
    user: User,
    nationalId: string,
    targetEnvironments?: Environment[],
  ): Promise<boolean> {
    const envsToDelete =
      targetEnvironments && targetEnvironments.length > 0
        ? targetEnvironments
        : environments

    let anyRequestMade = false
    let lastError: unknown = null

    for (const environment of envsToDelete) {
      let requestMade = false

      try {
        await this.typedRequest(user, environment, (api) => {
          requestMade = true
          return api.meApiScopeUsersControllerDeleteRaw({ nationalId })
        })

        if (requestMade) {
          anyRequestMade = true
        }
      } catch (error) {
        lastError = error
        this.logger.error(
          `Failed to delete API scope user in ${environment}`,
          error as Error,
        )
      }
    }

    if (anyRequestMade) {
      return true
    }

    throw lastError ?? new Error('Failed to delete API scope user')
  }
}

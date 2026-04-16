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
  ): Promise<AccessControlledScope[]> {
    for (const environment of environments) {
      const result = await this.typedRequest(user, environment, (api) =>
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
    let userData: ApiScopeUser | null = null
    const availableEnvironments: Environment[] = []

    for (const environment of environments) {
      const result = await this.typedRequest(user, environment, (api) =>
        api.meApiScopeUsersControllerFindOneRaw({ nationalId }),
      )

      if (result) {
        availableEnvironments.push(environment)
        if (!userData) {
          userData = {
            nationalId: result.nationalId,
            name: result.name ?? undefined,
            email: result.email,
            userAccess: result.userAccess?.map((access) => ({
              nationalId: access.nationalId,
              scope: access.scope,
            })),
          }
        }
      }
    }

    if (userData) {
      userData.availableEnvironments = availableEnvironments
    }

    return userData
  }

  async getApiScopeUsers(
    user: User,
    input: ApiScopeUsersInput,
  ): Promise<ApiScopeUsersPayload> {
    for (const environment of environments) {
      const result = await this.typedRequest(user, environment, (api) =>
        api.meApiScopeUsersControllerFindAndCountAllRaw({
          searchString: input.searchString ?? '',
          page: input.page,
          count: input.count,
        }),
      )

      if (result) {
        return {
          rows: result.rows.map((row: ApiScopeUserResponse) => ({
            nationalId: row.nationalId,
            name: row.name ?? undefined,
            email: row.email,
          })),
          totalCount: result.count,
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

    let lastResult: ApiScopeUser | null = null

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
          lastResult = {
            nationalId: result.nationalId,
            name: result.name ?? undefined,
            email: result.email,
            userAccess: result.userAccess?.map((access) => ({
              nationalId: access.nationalId,
              scope: access.scope,
            })),
          }
        }
      } catch (error) {
        this.logger.error(
          `Failed to create API scope user in ${environment}`,
          error as Error,
        )
      }
    }

    if (lastResult) {
      return lastResult
    }

    throw new Error('Failed to create API scope user')
  }

  async updateApiScopeUser(
    user: User,
    input: UpdateApiScopeUserInput,
  ): Promise<ApiScopeUser> {
    const inputEnvironments = input.environments
    const targetEnvironments = inputEnvironments?.length
      ? environments.filter((env) => inputEnvironments.includes(env))
      : environments

    let lastResult: ApiScopeUser | null = null

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
          lastResult = {
            nationalId: result.nationalId,
            name: result.name ?? undefined,
            email: result.email,
            userAccess: result.userAccess?.map((access) => ({
              nationalId: access.nationalId,
              scope: access.scope,
            })),
          }
        }
      } catch (error) {
        this.logger.error(
          `Failed to update API scope user in ${environment}`,
          error as Error,
        )
      }
    }

    if (lastResult) {
      return lastResult
    }

    throw new Error('Failed to update API scope user')
  }

  async deleteApiScopeUser(user: User, nationalId: string): Promise<boolean> {
    let anyRequestMade = false
    let lastError: unknown = null

    for (const environment of environments) {
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

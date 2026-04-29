import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import {
  ApiScope,
  ApiScopeUser as GeneratedApiScopeUser,
} from '@island.is/clients/auth/admin-api'
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

@Injectable()
export class ApiScopeUserService extends MultiEnvironmentService {
  getAvailableEnvironments(): Environment[] {
    return this.getConfiguredEnvironments()
  }

  async getAccessControlledScopes(
    user: User,
    environment?: Environment,
  ): Promise<AccessControlledScope[]> {
    const targetEnvironments = environment ? [environment] : environments

    for (const env of targetEnvironments) {
      const result = await this.makeRequest(user, env, (api) =>
        api.meApiScopeUsersControllerFindAllAccessControlledScopesRaw(),
      )

      if (result) {
        return result.map((scope: ApiScope) => ({
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
      const result = await this.makeRequest(user, environment, (api) =>
        api.meApiScopeUsersControllerFindOneRaw({
          xQueryNationalId: nationalId,
        }),
      )

      if (result) {
        availableEnvironments.push(environment)

        environmentsData.push({
          environment,
          nationalId: result.nationalId,
          name: result.name ?? undefined,
          email: result.email,
          userAccess: result.userAccess,
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
        const result = await this.makeRequest(user, environment, (api) =>
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
          rows: data.rows.map((row: GeneratedApiScopeUser) => ({
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

    if (inputEnvironments && inputEnvironments.length === 0) {
      throw new Error('environments must be specified')
    }

    const targetEnvironments = inputEnvironments?.length
      ? environments.filter((env) => inputEnvironments.includes(env))
      : environments

    const availableEnvironments: Environment[] = []
    const environmentsData: ApiScopeUserEnvironmentData[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meApiScopeUsersControllerCreateRaw({
            apiScopeUserDTO: {
              nationalId: input.nationalId,
              name: input.name,
              email: input.email,
              userAccess: input.userAccess ?? [],
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
            userAccess: result.userAccess,
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

    if (!targetEnvironments || targetEnvironments.length === 0) {
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
        const result = await this.makeRequest(user, environment, (api) =>
          api.meApiScopeUsersControllerUpdateRaw({
            xQueryNationalId: input.nationalId,
            apiScopeUserUpdateDTO: {
              name: input.name ?? undefined,
              email: input.email ?? undefined,
              userAccess: input.userAccess ?? [],
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
            userAccess: result.userAccess,
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
        await this.makeRequest(user, environment, (api) => {
          requestMade = true
          return api.meApiScopeUsersControllerDeleteRaw({
            xQueryNationalId: nationalId,
          })
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

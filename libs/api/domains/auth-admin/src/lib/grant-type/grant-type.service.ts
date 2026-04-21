import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { AdminApi } from '@island.is/clients/auth/admin-api'
import { ApiResponse } from '@island.is/clients/middlewares'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { environments } from '../shared/constants/environments'
import { GrantTypesPayload } from './dto/grant-types.payload'
import { GrantTypesInput } from './dto/grant-types.input'
import { CreateGrantTypeInput } from './dto/create-grant-type.input'
import { UpdateGrantTypeInput } from './dto/update-grant-type.input'
import { GrantType } from './models/grant-type.model'
import { GrantTypeEnvironmentData } from './models/grant-type-environment-data.model'

interface GrantTypeResponse {
  name: string
  description: string
  archived: Date | null
  created: Date
  modified: Date
}

interface PagedGrantTypesResponse {
  rows: GrantTypeResponse[]
  count: number
}

interface GrantTypesApi {
  meGrantTypesControllerFindAndCountAllRaw(params: {
    searchString?: string
    page: number
    count: number
  }): Promise<ApiResponse<PagedGrantTypesResponse>>

  meGrantTypesControllerFindOneRaw(params: {
    name: string
  }): Promise<ApiResponse<GrantTypeResponse>>

  meGrantTypesControllerCreateRaw(params: {
    grantTypeDTO: {
      name: string
      description: string
    }
  }): Promise<ApiResponse<GrantTypeResponse>>

  meGrantTypesControllerUpdateRaw(params: {
    name: string
    updateGrantTypeDto: {
      description: string
    }
  }): Promise<ApiResponse<GrantTypeResponse>>

  meGrantTypesControllerDeleteRaw(params: {
    name: string
  }): Promise<ApiResponse<void>>
}

const mapGrantType = (
  gt: GrantTypeResponse,
  environment: Environment,
): GrantTypeEnvironmentData => ({
  name: gt.name,
  description: gt.description,
  environment: environment,
  // The OpenAPI client converts `null` to `new Date(0)` (epoch), so we
  // check for a meaningful timestamp rather than just null/undefined.
  archived: gt.archived && gt.archived.getTime() > 0 ? gt.archived : undefined,
})

@Injectable()
export class GrantTypeService extends MultiEnvironmentService {
  private typedRequest<T>(
    user: User,
    environment: typeof environments[number],
    request: (api: GrantTypesApi) => Promise<ApiResponse<T>>,
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

  async getGrantTypes(
    user: User,
    input: GrantTypesInput,
  ): Promise<GrantTypesPayload> {
    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        const result = await this.typedRequest(user, environment, (api) =>
          api.meGrantTypesControllerFindAndCountAllRaw({
            searchString: input.searchString ?? '',
            page: input.page,
            count: input.count,
          }),
        )
        return result ? { environment, data: result } : null
      }),
    )

    // Build a map of grant type name -> environments it exists in
    const envMap = new Map<string, Environment[]>()
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { environment, data } = result.value
        for (const row of data.rows) {
          const existing = envMap.get(row.name) ?? []
          existing.push(environment)
          envMap.set(row.name, existing)
        }
      }
    }

    // Use the first successful environment as the primary result for pagination
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { data } = result.value
        return {
          rows: data.rows.map((row: GrantTypeResponse) => ({
            name: row.name,
            availableEnvironments: envMap.get(row.name),
            description: row.description,
            archived:
              row.archived && row.archived.getTime() > 0
                ? row.archived
                : undefined,
          })),
          totalCount: data.count,
        }
      }
    }

    return { rows: [], totalCount: 0 }
  }

  async getGrantType(user: User, name: string): Promise<GrantType | null> {
    const availableEnvironments: Environment[] = []
    const environmentsData: GrantTypeEnvironmentData[] = []

    for (const environment of environments) {
      const result = await this.typedRequest(user, environment, (api) =>
        api.meGrantTypesControllerFindOneRaw({ name }),
      )

      if (result) {
        availableEnvironments.push(environment)
        environmentsData.push({
          ...mapGrantType(result, environment),
        })
      }
    }

    if (environmentsData.length === 0) {
      return null
    }

    const first = environmentsData[0]
    return {
      name: first.name,
      availableEnvironments,
      environments: environmentsData,
    }
  }

  async createGrantType(
    user: User,
    input: CreateGrantTypeInput,
  ): Promise<GrantType> {
    const inputEnvironments = input.environments
    const targetEnvironments = inputEnvironments?.length
      ? environments.filter((env) => inputEnvironments.includes(env))
      : environments

    const availableEnvironments: Environment[] = []
    const environmentsData: GrantTypeEnvironmentData[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.typedRequest(user, environment, (api) =>
          api.meGrantTypesControllerCreateRaw({
            grantTypeDTO: {
              name: input.name,
              description: input.description,
            },
          }),
        )

        if (result) {
          availableEnvironments.push(environment)
          environmentsData.push({
            ...mapGrantType(result, environment),
          })
        }
      } catch (error) {
        this.logger.error(
          `Failed to create grant type in ${environment}`,
          error as Error,
        )
      }
    }

    if (environmentsData.length > 0) {
      const first = environmentsData[0]
      return {
        name: first.name,
        availableEnvironments,
        environments: environmentsData,
      }
    }

    throw new Error('Failed to create grant type')
  }

  async updateGrantType(
    user: User,
    input: UpdateGrantTypeInput,
  ): Promise<GrantType> {
    const targetEnvironments = input.environments

    if (!targetEnvironments) {
      const existing = await this.getGrantType(user, input.name)
      if (!existing) {
        throw new Error('Grant type not found')
      }
      return existing
    }

    const availableEnvironments: Environment[] = []
    const environmentsData: GrantTypeEnvironmentData[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.typedRequest(user, environment, (api) =>
          api.meGrantTypesControllerUpdateRaw({
            name: input.name,
            updateGrantTypeDto: {
              description: input.description,
            },
          }),
        )

        if (result) {
          availableEnvironments.push(environment)
          environmentsData.push({
            ...mapGrantType(result, environment),
          })
        }
      } catch (error) {
        this.logger.error(
          `Failed to update grant type in ${environment}`,
          error as Error,
        )
      }
    }

    if (environmentsData.length > 0) {
      const first = environmentsData[0]
      return {
        name: first.name,
        availableEnvironments,
        environments: environmentsData,
      }
    }

    throw new Error('Failed to update grant type')
  }

  async deleteGrantType(
    user: User,
    name: string,
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
          return api.meGrantTypesControllerDeleteRaw({ name })
        })

        if (requestMade) {
          anyRequestMade = true
        }
      } catch (error) {
        lastError = error
        this.logger.error(
          `Failed to delete grant type in ${environment}`,
          error as Error,
        )
      }
    }

    if (anyRequestMade) {
      return true
    }

    throw lastError ?? new Error('Failed to delete grant type')
  }
}

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

const mapGrantType = (gt: GrantTypeResponse): GrantType => ({
  name: gt.name,
  description: gt.description,
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
    for (const environment of environments) {
      const result = await this.typedRequest(user, environment, (api) =>
        api.meGrantTypesControllerFindAndCountAllRaw({
          searchString: input.searchString ?? '',
          page: input.page,
          count: input.count,
        }),
      )

      if (result) {
        return {
          rows: result.rows.map(mapGrantType),
          totalCount: result.count,
        }
      }
    }

    return { rows: [], totalCount: 0 }
  }

  async getGrantType(
    user: User,
    name: string,
  ): Promise<GrantType | null> {
    let grantTypeData: GrantType | null = null
    const availableEnvironments: Environment[] = []

    for (const environment of environments) {
      const result = await this.typedRequest(user, environment, (api) =>
        api.meGrantTypesControllerFindOneRaw({ name }),
      )

      if (result) {
        availableEnvironments.push(environment)
        if (!grantTypeData) {
          grantTypeData = mapGrantType(result)
        }
      }
    }

    if (grantTypeData) {
      grantTypeData.availableEnvironments = availableEnvironments
    }

    return grantTypeData
  }

  async createGrantType(
    user: User,
    input: CreateGrantTypeInput,
  ): Promise<GrantType> {
    const inputEnvironments = input.environments
    const targetEnvironments = inputEnvironments?.length
      ? environments.filter((env) => inputEnvironments.includes(env))
      : environments

    let lastResult: GrantType | null = null

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
          lastResult = mapGrantType(result)
        }
      } catch (error) {
        this.logger.error(
          `Failed to create grant type in ${environment}`,
          error as Error,
        )
      }
    }

    if (lastResult) {
      return lastResult
    }

    throw new Error('Failed to create grant type')
  }

  async updateGrantType(
    user: User,
    input: UpdateGrantTypeInput,
  ): Promise<GrantType> {
    const inputEnvironments = input.environments
    const targetEnvironments = inputEnvironments?.length
      ? environments.filter((env) => inputEnvironments.includes(env))
      : environments

    let lastResult: GrantType | null = null

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
          lastResult = mapGrantType(result)
        }
      } catch (error) {
        this.logger.error(
          `Failed to update grant type in ${environment}`,
          error as Error,
        )
      }
    }

    if (lastResult) {
      return lastResult
    }

    throw new Error('Failed to update grant type')
  }

  async deleteGrantType(user: User, name: string): Promise<boolean> {
    let anyRequestMade = false
    let lastError: unknown = null

    for (const environment of environments) {
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

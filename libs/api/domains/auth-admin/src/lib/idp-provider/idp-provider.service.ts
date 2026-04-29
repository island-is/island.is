import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { AdminApi } from '@island.is/clients/auth/admin-api'
import { ApiResponse } from '@island.is/clients/middlewares'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { environments } from '../shared/constants/environments'
import { IdpProvidersPayload } from './dto/idp-providers.payload'
import { IdpProvidersInput } from './dto/idp-providers.input'
import { CreateIdpProviderInput } from './dto/create-idp-provider.input'
import { UpdateIdpProviderInput } from './dto/update-idp-provider.input'
import { IdpProvider } from './models/idp-provider.model'
import { IdpProviderEnvironmentData } from './models/idp-provider-environment-data.model'

interface IdpProviderResponse {
  name: string
  description: string
  helptext: string
  level: number
  created: Date
  modified: Date
}

interface PagedIdpProvidersResponse {
  rows: IdpProviderResponse[]
  count: number
}

interface IdpProvidersApi {
  meIdpProvidersControllerFindAndCountAllRaw(params: {
    searchString?: string
    page: number
    count: number
  }): Promise<ApiResponse<PagedIdpProvidersResponse>>

  meIdpProvidersControllerFindOneRaw(params: {
    name: string
  }): Promise<ApiResponse<IdpProviderResponse>>

  meIdpProvidersControllerCreateRaw(params: {
    idpProviderDTO: {
      name: string
      description: string
      helptext: string
      level: number
    }
  }): Promise<ApiResponse<IdpProviderResponse>>

  meIdpProvidersControllerUpdateRaw(params: {
    name: string
    updateIdpProviderDto: {
      description: string
      helptext: string
      level: number
    }
  }): Promise<ApiResponse<IdpProviderResponse>>

  meIdpProvidersControllerDeleteRaw(params: {
    name: string
  }): Promise<ApiResponse<void>>
}

const mapIdpProvider = (
  idp: IdpProviderResponse,
  environment: Environment,
): IdpProviderEnvironmentData => ({
  name: idp.name,
  description: idp.description,
  helptext: idp.helptext,
  level: idp.level,
  environment: environment,
})

@Injectable()
export class IdpProviderService extends MultiEnvironmentService {
  private typedRequest<T>(
    user: User,
    environment: typeof environments[number],
    request: (api: IdpProvidersApi) => Promise<ApiResponse<T>>,
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

  async getIdpProviders(
    user: User,
    input: IdpProvidersInput,
  ): Promise<IdpProvidersPayload> {
    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        const result = await this.typedRequest(user, environment, (api) =>
          api.meIdpProvidersControllerFindAndCountAllRaw({
            searchString: input.searchString ?? '',
            page: input.page,
            count: input.count,
          }),
        )
        return result ? { environment, data: result } : null
      }),
    )

    // Build map of idp provider name -> environments
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
          rows: data.rows.map((row: IdpProviderResponse) => ({
            name: row.name,
            availableEnvironments: envMap.get(row.name) ?? [],
            description: row.description,
            helptext: row.helptext,
            level: row.level,
          })),
          totalCount: data.count,
        }
      }
    }

    return { rows: [], totalCount: 0 }
  }

  async getIdpProvider(
    user: User,
    name: string,
  ): Promise<IdpProvider | null> {
    const availableEnvironments: Environment[] = []
    const environmentsData: IdpProviderEnvironmentData[] = []

    for (const environment of environments) {
      const result = await this.typedRequest(user, environment, (api) =>
        api.meIdpProvidersControllerFindOneRaw({ name }),
      )

      if (result) {
        availableEnvironments.push(environment)
        environmentsData.push({
          ...mapIdpProvider(result, environment),
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

  async createIdpProvider(
    user: User,
    input: CreateIdpProviderInput,
  ): Promise<IdpProvider> {
    const inputEnvironments = input.environments
    const targetEnvironments = inputEnvironments?.length
      ? environments.filter((env) => inputEnvironments.includes(env))
      : environments

    const availableEnvironments: Environment[] = []
    const environmentsData: IdpProviderEnvironmentData[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.typedRequest(user, environment, (api) =>
          api.meIdpProvidersControllerCreateRaw({
            idpProviderDTO: {
              name: input.name,
              description: input.description,
              helptext: input.helptext,
              level: input.level,
            },
          }),
        )

        if (result) {
          availableEnvironments.push(environment)
          environmentsData.push({
            ...mapIdpProvider(result, environment),
          })
        }
      } catch (error) {
        this.logger.error(
          `Failed to create IDP provider in ${environment}`,
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

    throw new Error('Failed to create IDP provider')
  }

  async updateIdpProvider(
    user: User,
    input: UpdateIdpProviderInput,
  ): Promise<IdpProvider> {
    const targetEnvironments = input.environments

    if (!targetEnvironments) {
      const existing = await this.getIdpProvider(user, input.name)
      if (!existing) {
        throw new Error('IDP provider not found')
      }
      return existing
    }

    const availableEnvironments: Environment[] = []
    const environmentsData: IdpProviderEnvironmentData[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.typedRequest(user, environment, (api) =>
          api.meIdpProvidersControllerUpdateRaw({
            name: input.name,
            updateIdpProviderDto: {
              description: input.description,
              helptext: input.helptext,
              level: input.level,
            },
          }),
        )

        if (result) {
          availableEnvironments.push(environment)
          environmentsData.push({
            ...mapIdpProvider(result, environment),
          })
        }
      } catch (error) {
        this.logger.error(
          `Failed to update IDP provider in ${environment}`,
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

    throw new Error('Failed to update IDP provider')
  }

  async deleteIdpProvider(
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
          return api.meIdpProvidersControllerDeleteRaw({ name })
        })

        if (requestMade) {
          anyRequestMade = true
        }
      } catch (error) {
        lastError = error
        this.logger.error(
          `Failed to delete IDP provider in ${environment}`,
          error as Error,
        )
      }
    }

    if (anyRequestMade) {
      return true
    }

    throw lastError ?? new Error('Failed to delete IDP provider')
  }
}

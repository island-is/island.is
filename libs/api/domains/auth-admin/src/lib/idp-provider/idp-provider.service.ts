import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { GeneratedIdpProvider } from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { environments } from '../shared/constants/environments'
import { EnvironmentFailure } from '../shared/models/multi-environment-result.model'
import { DeleteEnvironmentResult } from '../shared/models/delete-environment-result.model'
import { IdpProvidersPayload } from './dto/idp-providers.payload'
import { IdpProvidersInput } from './dto/idp-providers.input'
import { CreateIdpProviderInput } from './dto/create-idp-provider.input'
import { UpdateIdpProviderInput } from './dto/update-idp-provider.input'
import { IdpProvider } from './models/idp-provider.model'
import { IdpProviderEnvironmentData } from './models/idp-provider-environment-data.model'

const mapIdpProvider = (
  idp: GeneratedIdpProvider,
  environment: Environment,
): IdpProviderEnvironmentData => ({
  name: idp.name,
  description: idp.description,
  helptext: idp.helptext,
  level: idp.level,
  environment: environment,
})

const toFailure = (
  environment: Environment,
  error: unknown,
): EnvironmentFailure => ({
  environment,
  message: error instanceof Error ? error.message : 'Unknown error',
})

@Injectable()
export class IdpProviderService extends MultiEnvironmentService {
  getAvailableEnvironments(): Environment[] {
    return this.getConfiguredEnvironments()
  }

  async getIdpProviders(
    user: User,
    input: IdpProvidersInput,
  ): Promise<IdpProvidersPayload> {
    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        const result = await this.makeRequest(user, environment, (api) =>
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

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { data } = result.value
        return {
          rows: data.rows.map((row: GeneratedIdpProvider) => ({
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

  async getIdpProvider(user: User, name: string): Promise<IdpProvider | null> {
    const availableEnvironments: Environment[] = []
    const environmentsData: IdpProviderEnvironmentData[] = []

    for (const environment of environments) {
      const result = await this.makeRequest(user, environment, (api) =>
        api.meIdpProvidersControllerFindOneRaw({ name }),
      )

      if (result) {
        availableEnvironments.push(environment)
        environmentsData.push(mapIdpProvider(result, environment))
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
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
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
          environmentsData.push(mapIdpProvider(result, environment))
        }
      } catch (error) {
        this.logger.error(
          `Failed to create IDP provider in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (environmentsData.length > 0) {
      const first = environmentsData[0]
      return {
        name: first.name,
        availableEnvironments,
        environments: environmentsData,
        ...(failedEnvironments.length > 0 && { failedEnvironments }),
      }
    }

    throw new Error('Failed to create IDP provider in all environments')
  }

  async updateIdpProvider(
    user: User,
    input: UpdateIdpProviderInput,
  ): Promise<IdpProvider> {
    const targetEnvironments = input.environments

    if (!targetEnvironments || targetEnvironments.length === 0) {
      throw new Error(
        'Environments must be specified when updating an IDP provider',
      )
    }

    const availableEnvironments: Environment[] = []
    const environmentsData: IdpProviderEnvironmentData[] = []
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
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
          environmentsData.push(mapIdpProvider(result, environment))
        }
      } catch (error) {
        this.logger.error(
          `Failed to update IDP provider in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (environmentsData.length > 0) {
      const first = environmentsData[0]
      return {
        name: first.name,
        availableEnvironments,
        environments: environmentsData,
        ...(failedEnvironments.length > 0 && { failedEnvironments }),
      }
    }

    throw new Error('Failed to update IDP provider in all environments')
  }

  async deleteIdpProvider(
    user: User,
    name: string,
    targetEnvironments?: Environment[],
  ): Promise<DeleteEnvironmentResult> {
    const envsToDelete =
      targetEnvironments && targetEnvironments.length > 0
        ? targetEnvironments
        : environments

    const deletedEnvironments: Environment[] = []
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of envsToDelete) {
      try {
        await this.makeRequest(user, environment, (api) =>
          api.meIdpProvidersControllerDeleteRaw({
            name,
            deleteIdpProviderDto: {
              environments: [environment],
            },
          }),
        )
        deletedEnvironments.push(environment)
      } catch (error) {
        this.logger.error(
          `Failed to delete IDP provider in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (deletedEnvironments.length === 0) {
      throw new Error('Failed to delete IDP provider in all environments')
    }

    return {
      success: failedEnvironments.length === 0,
      affectedEnvironments: deletedEnvironments,
      ...(failedEnvironments.length > 0 && { failedEnvironments }),
    }
  }
}

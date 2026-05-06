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
    // Pull every matching row from each environment so we can merge by name.
    // Per-env pagination would silently drop rows that only exist in one
    // environment.
    const FETCH_LIMIT = 10000

    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meIdpProvidersControllerFindAndCountAllRaw({
            searchString: input.searchString ?? '',
            page: 1,
            count: FETCH_LIMIT,
          }),
        )
        return result ? { environment, data: result } : null
      }),
    )

    const rowMap = new Map<
      string,
      { row: GeneratedIdpProvider; envs: Environment[] }
    >()
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { environment, data } = result.value
        if (data.count > FETCH_LIMIT) {
          this.logger.warn(
            `IDP provider count in ${environment} (${data.count}) exceeds fetch limit (${FETCH_LIMIT}); some rows will be missing from the merged list`,
          )
        }
        for (const row of data.rows) {
          const existing = rowMap.get(row.name)
          if (existing) {
            existing.envs.push(environment)
          } else {
            rowMap.set(row.name, { row, envs: [environment] })
          }
        }
      }
    }

    const allRows = Array.from(rowMap.values()).sort((a, b) =>
      a.row.name.localeCompare(b.row.name),
    )

    const offset = Math.max(0, (input.page - 1) * input.count)
    const pageRows = allRows.slice(offset, offset + input.count)

    return {
      rows: pageRows.map(({ row, envs }) => ({
        name: row.name,
        availableEnvironments: envs,
        description: row.description,
        helptext: row.helptext,
        level: row.level,
      })),
      totalCount: allRows.length,
    }
  }

  async getIdpProvider(user: User, name: string): Promise<IdpProvider | null> {
    const results = await Promise.all(
      environments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meIdpProvidersControllerFindOneRaw({ name }),
        ).then((result) => ({ environment, result })),
      ),
    )

    const availableEnvironments: Environment[] = []
    const environmentsData: IdpProviderEnvironmentData[] = []
    for (const { environment, result } of results) {
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

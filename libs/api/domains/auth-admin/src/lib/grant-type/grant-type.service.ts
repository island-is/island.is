import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { GrantType as GeneratedGrantType } from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { environments } from '../shared/constants/environments'
import { EnvironmentFailure } from '../shared/models/multi-environment-result.model'
import { DeleteEnvironmentResult } from '../shared/models/delete-environment-result.model'
import { GrantTypesPayload } from './dto/grant-types.payload'
import { GrantTypesInput } from './dto/grant-types.input'
import { CreateGrantTypeInput } from './dto/create-grant-type.input'
import { UpdateGrantTypeInput } from './dto/update-grant-type.input'
import { GrantType } from './models/grant-type.model'
import { GrantTypeEnvironmentData } from './models/grant-type-environment-data.model'

const mapGrantType = (
  gt: GeneratedGrantType,
  environment: Environment,
): GrantTypeEnvironmentData => ({
  name: gt.name,
  description: gt.description,
  environment: environment,
  // The OpenAPI client converts `null` to `new Date(0)` (epoch), so we
  // check for a meaningful timestamp rather than just null/undefined.
  archived: gt.archived && gt.archived.getTime() > 0 ? gt.archived : undefined,
})

const toFailure = (
  environment: Environment,
  error: unknown,
): EnvironmentFailure => ({
  environment,
  message: error instanceof Error ? error.message : 'Unknown error',
})

@Injectable()
export class GrantTypeService extends MultiEnvironmentService {
  getAvailableEnvironments(): Environment[] {
    return this.getConfiguredEnvironments()
  }

  async getGrantTypes(
    user: User,
    input: GrantTypesInput,
  ): Promise<GrantTypesPayload> {
    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meGrantTypesControllerFindAndCountAllRaw({
            searchString: input.searchString ?? '',
            page: input.page,
            count: input.count,
          }),
        )
        return result ? { environment, data: result } : null
      }),
    )

    // Build maps of grant type name -> environments and archived environments
    const envMap = new Map<string, Environment[]>()
    const archivedEnvMap = new Map<string, Environment[]>()
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { environment, data } = result.value
        for (const row of data.rows) {
          const existing = envMap.get(row.name) ?? []
          existing.push(environment)
          envMap.set(row.name, existing)

          if (row.archived && row.archived.getTime() > 0) {
            const archivedExisting = archivedEnvMap.get(row.name) ?? []
            archivedExisting.push(environment)
            archivedEnvMap.set(row.name, archivedExisting)
          }
        }
      }
    }

    // Use the first successful environment as the primary result for pagination
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { data } = result.value
        return {
          rows: data.rows.map((row: GeneratedGrantType) => {
            const allEnvs = envMap.get(row.name) ?? []
            const archivedEnvs = archivedEnvMap.get(row.name) ?? []
            const isFullyArchived =
              archivedEnvs.length > 0 && archivedEnvs.length === allEnvs.length
            const nonArchivedEnvs = allEnvs.filter(
              (e) => !archivedEnvs.includes(e),
            )
            return {
              name: row.name,
              availableEnvironments: isFullyArchived
                ? allEnvs
                : nonArchivedEnvs,
              description: row.description,
              archived: isFullyArchived
                ? new Date(row.archived ?? '')
                : undefined,
            }
          }),
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
      const result = await this.makeRequest(user, environment, (api) =>
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
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
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

    throw new Error('Failed to create grant type in all environments')
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
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
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

    throw new Error('Failed to update grant type in all environments')
  }

  async deleteGrantType(
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
          api.meGrantTypesControllerDeleteRaw({ name }),
        )
        deletedEnvironments.push(environment)
      } catch (error) {
        this.logger.error(
          `Failed to delete grant type in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (deletedEnvironments.length === 0) {
      throw new Error('Failed to delete grant type in all environments')
    }

    return {
      success: failedEnvironments.length === 0,
      affectedEnvironments: deletedEnvironments,
      ...(failedEnvironments.length > 0 && { failedEnvironments }),
    }
  }

  async restoreGrantType(
    user: User,
    name: string,
    targetEnvironments?: Environment[],
  ): Promise<DeleteEnvironmentResult> {
    const envsToRestore =
      targetEnvironments && targetEnvironments.length > 0
        ? targetEnvironments
        : environments

    const restoredEnvironments: Environment[] = []
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of envsToRestore) {
      try {
        await this.makeRequest(user, environment, (api) =>
          api.meGrantTypesControllerRestoreRaw({ name }),
        )
        restoredEnvironments.push(environment)
      } catch (error) {
        this.logger.error(
          `Failed to restore grant type in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (restoredEnvironments.length === 0) {
      throw new Error('Failed to restore grant type in all environments')
    }

    return {
      success: failedEnvironments.length === 0,
      affectedEnvironments: restoredEnvironments,
      ...(failedEnvironments.length > 0 && { failedEnvironments }),
    }
  }
}

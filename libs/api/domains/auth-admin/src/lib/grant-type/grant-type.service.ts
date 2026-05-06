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
    // Pull every matching row from each environment so we can merge by name.
    // Per-env pagination would silently drop rows that only exist in one
    // environment.
    const FETCH_LIMIT = 10000

    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meGrantTypesControllerFindAndCountAllRaw({
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
      {
        row: GeneratedGrantType
        envs: Environment[]
        archivedEnvs: Environment[]
      }
    >()
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { environment, data } = result.value
        if (data.count > FETCH_LIMIT) {
          this.logger.warn(
            `Grant type count in ${environment} (${data.count}) exceeds fetch limit (${FETCH_LIMIT}); some rows will be missing from the merged list`,
          )
        }
        for (const row of data.rows) {
          const existing = rowMap.get(row.name)
          if (existing) {
            existing.envs.push(environment)
          } else {
            rowMap.set(row.name, {
              row,
              envs: [environment],
              archivedEnvs: [],
            })
          }
          if (row.archived && row.archived.getTime() > 0) {
            rowMap.get(row.name)?.archivedEnvs.push(environment)
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
      rows: pageRows.map(({ row, envs, archivedEnvs }) => {
        const isFullyArchived =
          archivedEnvs.length > 0 && archivedEnvs.length === envs.length
        const nonArchivedEnvs = envs.filter((e) => !archivedEnvs.includes(e))
        return {
          name: row.name,
          availableEnvironments: isFullyArchived ? envs : nonArchivedEnvs,
          description: row.description,
          archived: isFullyArchived ? new Date(row.archived ?? '') : undefined,
        }
      }),
      totalCount: allRows.length,
    }
  }

  async getGrantType(user: User, name: string): Promise<GrantType | null> {
    const results = await Promise.all(
      environments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meGrantTypesControllerFindOneRaw({ name }),
        ).then((result) => ({ environment, result })),
      ),
    )

    const availableEnvironments: Environment[] = []
    const environmentsData: GrantTypeEnvironmentData[] = []
    for (const { environment, result } of results) {
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

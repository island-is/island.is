import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { GeneratedLanguage } from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { environments } from '../shared/constants/environments'
import { EnvironmentFailure } from '../shared/models/multi-environment-result.model'
import { DeleteEnvironmentResult } from '../shared/models/delete-environment-result.model'
import { LanguagesPayload } from './dto/languages.payload'
import { LanguagesInput } from './dto/languages.input'
import { CreateLanguageInput } from './dto/create-language.input'
import { UpdateLanguageInput } from './dto/update-language.input'
import { Language } from './models/language.model'
import { LanguageEnvironmentData } from './models/language-environment-data.model'

const mapLanguage = (
  language: GeneratedLanguage,
  environment: Environment,
): LanguageEnvironmentData => ({
  environment,
  isoKey: language.isoKey,
  description: language.description,
  englishDescription: language.englishDescription,
})

const toFailure = (
  environment: Environment,
  error: unknown,
): EnvironmentFailure => ({
  environment,
  message: error instanceof Error ? error.message : 'Unknown error',
})

@Injectable()
export class LanguageService extends MultiEnvironmentService {
  getAvailableEnvironments(): Environment[] {
    return this.getConfiguredEnvironments()
  }

  async getLanguages(
    user: User,
    input: LanguagesInput,
  ): Promise<LanguagesPayload> {
    const FETCH_LIMIT = 10000

    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meLanguagesControllerFindAndCountAllRaw({
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
      { row: GeneratedLanguage; envs: Environment[] }
    >()
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { environment, data } = result.value
        if (data.count > FETCH_LIMIT) {
          this.logger.warn(
            `Language count in ${environment} (${data.count}) exceeds fetch limit (${FETCH_LIMIT}); some rows will be missing from the merged list`,
          )
        }
        for (const row of data.rows) {
          const existing = rowMap.get(row.isoKey)
          if (existing) {
            existing.envs.push(environment)
          } else {
            rowMap.set(row.isoKey, { row, envs: [environment] })
          }
        }
      }
    }

    const allRows = Array.from(rowMap.values()).sort((a, b) =>
      a.row.isoKey.localeCompare(b.row.isoKey),
    )

    const offset = Math.max(0, (input.page - 1) * input.count)
    const pageRows = allRows.slice(offset, offset + input.count)

    return {
      rows: pageRows.map(({ row, envs }) => ({
        isoKey: row.isoKey,
        description: row.description,
        englishDescription: row.englishDescription,
        availableEnvironments: envs,
      })),
      totalCount: allRows.length,
    }
  }

  async getLanguage(user: User, isoKey: string): Promise<Language | null> {
    const availableEnvironments: Environment[] = []
    const environmentsData: LanguageEnvironmentData[] = []

    for (const environment of environments) {
      const result = await this.makeRequest(user, environment, (api) =>
        api.meLanguagesControllerFindOneRaw({ isoKey }),
      )

      if (result) {
        availableEnvironments.push(environment)
        environmentsData.push(mapLanguage(result, environment))
      }
    }

    if (environmentsData.length === 0) {
      return null
    }

    return {
      isoKey,
      availableEnvironments,
      environments: environmentsData,
    }
  }

  async createLanguage(
    user: User,
    input: CreateLanguageInput,
  ): Promise<Language> {
    const inputEnvironments = input.environments
    const targetEnvironments = inputEnvironments?.length
      ? environments.filter((env) => inputEnvironments.includes(env))
      : environments

    const availableEnvironments: Environment[] = []
    const environmentsData: LanguageEnvironmentData[] = []
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meLanguagesControllerCreateRaw({
            languageDTO: {
              isoKey: input.isoKey,
              description: input.description,
              englishDescription: input.englishDescription,
            },
          }),
        )

        if (result) {
          availableEnvironments.push(environment)
          environmentsData.push(mapLanguage(result, environment))
        }
      } catch (error) {
        this.logger.error(
          `Failed to create language in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (environmentsData.length > 0) {
      return {
        isoKey: input.isoKey,
        availableEnvironments,
        environments: environmentsData,
        ...(failedEnvironments.length > 0 && { failedEnvironments }),
      }
    }

    throw new Error('Failed to create language in all environments')
  }

  async updateLanguage(
    user: User,
    input: UpdateLanguageInput,
  ): Promise<Language> {
    const targetEnvironments = input.environments

    if (!targetEnvironments || targetEnvironments.length === 0) {
      throw new Error('Environments must be specified when updating a language')
    }

    const availableEnvironments: Environment[] = []
    const environmentsData: LanguageEnvironmentData[] = []
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meLanguagesControllerUpdateRaw({
            isoKey: input.isoKey,
            updateLanguageDto: {
              description: input.description,
              englishDescription: input.englishDescription,
            },
          }),
        )

        if (result) {
          availableEnvironments.push(environment)
          environmentsData.push(mapLanguage(result, environment))
        }
      } catch (error) {
        this.logger.error(
          `Failed to update language in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (environmentsData.length > 0) {
      return {
        isoKey: input.isoKey,
        availableEnvironments,
        environments: environmentsData,
        ...(failedEnvironments.length > 0 && { failedEnvironments }),
      }
    }

    throw new Error('Failed to update language in all environments')
  }

  async deleteLanguage(
    user: User,
    isoKey: string,
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
          api.meLanguagesControllerDeleteRaw({
            isoKey,
            deleteLanguageDto: {
              environments: [environment],
            },
          }),
        )
        deletedEnvironments.push(environment)
      } catch (error) {
        this.logger.error(
          `Failed to delete language in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (deletedEnvironments.length === 0) {
      throw new Error('Failed to delete language in all environments')
    }

    return {
      success: failedEnvironments.length === 0,
      affectedEnvironments: deletedEnvironments,
      ...(failedEnvironments.length > 0 && { failedEnvironments }),
    }
  }
}

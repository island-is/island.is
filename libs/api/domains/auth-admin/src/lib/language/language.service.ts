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
    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meLanguagesControllerFindAndCountAllRaw({
            searchString: input.searchString ?? '',
            page: input.page,
            count: input.count,
          }),
        )
        return result ? { environment, data: result } : null
      }),
    )

    const envMap = new Map<string, Environment[]>()
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { environment, data } = result.value
        for (const row of data.rows) {
          const existing = envMap.get(row.isoKey) ?? []
          existing.push(environment)
          envMap.set(row.isoKey, existing)
        }
      }
    }

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { data } = result.value
        return {
          rows: data.rows.map((row: GeneratedLanguage) => ({
            isoKey: row.isoKey,
            description: row.description,
            englishDescription: row.englishDescription,
            availableEnvironments: envMap.get(row.isoKey) ?? [],
          })),
          totalCount: data.count,
        }
      }
    }

    return { rows: [], totalCount: 0 }
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

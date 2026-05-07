import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import {
  GeneratedLanguage,
  GeneratedTranslation,
} from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { environments } from '../shared/constants/environments'
import { EnvironmentFailure } from '../shared/models/multi-environment-result.model'
import { DeleteEnvironmentResult } from '../shared/models/delete-environment-result.model'
import { TranslationsPayload } from './dto/translations.payload'
import { TranslationsInput } from './dto/translations.input'
import { TranslationKeyInput } from './dto/translation-key.input'
import { CreateTranslationInput } from './dto/create-translation.input'
import { UpdateTranslationInput } from './dto/update-translation.input'
import { Translation } from './models/translation.model'
import { TranslationEnvironmentData } from './models/translation-environment-data.model'
import { TranslationLanguage } from './models/translation-language.model'

const compositeKey = (
  t: Pick<GeneratedTranslation, 'language' | 'className' | 'property' | 'key'>,
) => `${t.language}|${t.className}|${t.property}|${t.key}`

const mapTranslation = (
  translation: GeneratedTranslation,
  environment: Environment,
): TranslationEnvironmentData => ({
  environment,
  language: translation.language,
  className: translation.className,
  property: translation.property,
  key: translation.key,
  value: translation.value ?? undefined,
})

const toFailure = (
  environment: Environment,
  error: unknown,
): EnvironmentFailure => ({
  environment,
  message: error instanceof Error ? error.message : 'Unknown error',
})

@Injectable()
export class TranslationService extends MultiEnvironmentService {
  getAvailableEnvironments(): Environment[] {
    return this.getConfiguredEnvironments()
  }

  async getTranslations(
    user: User,
    input: TranslationsInput,
  ): Promise<TranslationsPayload> {
    const FETCH_LIMIT = 10000

    const results = await Promise.allSettled(
      environments.map(async (environment) => {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meTranslationsControllerFindAndCountAllRaw({
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
      { row: GeneratedTranslation; envs: Environment[] }
    >()
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const { environment, data } = result.value
        if (data.count > FETCH_LIMIT) {
          this.logger.warn(
            `Translation count in ${environment} (${data.count}) exceeds fetch limit (${FETCH_LIMIT}); some rows will be missing from the merged list`,
          )
        }
        for (const row of data.rows) {
          const k = compositeKey(row)
          const existing = rowMap.get(k)
          if (existing) {
            existing.envs.push(environment)
          } else {
            rowMap.set(k, { row, envs: [environment] })
          }
        }
      }
    }

    const allRows = Array.from(rowMap.values()).sort((a, b) =>
      compositeKey(a.row).localeCompare(compositeKey(b.row)),
    )

    const offset = Math.max(0, (input.page - 1) * input.count)
    const pageRows = allRows.slice(offset, offset + input.count)

    return {
      rows: pageRows.map(({ row, envs }) => ({
        language: row.language,
        className: row.className,
        property: row.property,
        key: row.key,
        value: row.value ?? undefined,
        availableEnvironments: envs,
      })),
      totalCount: allRows.length,
    }
  }

  async getTranslation(
    user: User,
    input: TranslationKeyInput,
  ): Promise<Translation | null> {
    const settled = await Promise.allSettled(
      environments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meTranslationsControllerFindOneRaw({
            language: input.language,
            className: input.className,
            property: input.property,
            key: input.key,
          }),
        ).then((result) => ({ environment, result })),
      ),
    )

    const availableEnvironments: Environment[] = []
    const environmentsData: TranslationEnvironmentData[] = []
    for (const entry of settled) {
      if (entry.status === 'rejected') {
        this.logger.error(
          'Failed to fetch translation in one environment',
          entry.reason as Error,
        )
        continue
      }
      const { environment, result } = entry.value
      if (result) {
        availableEnvironments.push(environment)
        environmentsData.push(mapTranslation(result, environment))
      }
    }

    if (environmentsData.length === 0) {
      return null
    }

    return {
      language: input.language,
      className: input.className,
      property: input.property,
      key: input.key,
      availableEnvironments,
      environments: environmentsData,
    }
  }

  async getLanguagesForDropdown(user: User): Promise<TranslationLanguage[]> {
    for (const environment of environments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meLanguagesControllerFindAllRaw(),
        )

        if (result) {
          return result.map((language: GeneratedLanguage) => ({
            isoKey: language.isoKey,
            description: language.description,
            englishDescription: language.englishDescription,
          }))
        }
      } catch (error) {
        this.logger.error(
          `Failed to fetch languages from ${environment} for dropdown; falling through to next env`,
          error as Error,
        )
      }
    }

    return []
  }

  async createTranslation(
    user: User,
    input: CreateTranslationInput,
  ): Promise<Translation> {
    const inputEnvironments = input.environments
    const targetEnvironments = inputEnvironments?.length
      ? environments.filter((env) => inputEnvironments.includes(env))
      : environments

    const availableEnvironments: Environment[] = []
    const environmentsData: TranslationEnvironmentData[] = []
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meTranslationsControllerCreateRaw({
            createTranslationDto: {
              language: input.language,
              className: input.className,
              property: input.property,
              key: input.key,
              value: input.value ?? '',
            },
          }),
        )

        if (result) {
          availableEnvironments.push(environment)
          environmentsData.push(mapTranslation(result, environment))
        }
      } catch (error) {
        this.logger.error(
          `Failed to create translation in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (environmentsData.length > 0) {
      return {
        language: input.language,
        className: input.className,
        property: input.property,
        key: input.key,
        availableEnvironments,
        environments: environmentsData,
        ...(failedEnvironments.length > 0 && { failedEnvironments }),
      }
    }

    throw new Error('Failed to create translation in all environments')
  }

  async updateTranslation(
    user: User,
    input: UpdateTranslationInput,
  ): Promise<Translation> {
    const targetEnvironments = input.environments

    if (!targetEnvironments || targetEnvironments.length === 0) {
      throw new Error(
        'Environments must be specified when updating a translation',
      )
    }

    const availableEnvironments: Environment[] = []
    const environmentsData: TranslationEnvironmentData[] = []
    const failedEnvironments: EnvironmentFailure[] = []

    for (const environment of targetEnvironments) {
      try {
        const result = await this.makeRequest(user, environment, (api) =>
          api.meTranslationsControllerUpdateRaw({
            language: input.language,
            className: input.className,
            property: input.property,
            key: input.key,
            updateTranslationDto: {
              value: input.value,
            },
          }),
        )

        if (result) {
          availableEnvironments.push(environment)
          environmentsData.push(mapTranslation(result, environment))
        }
      } catch (error) {
        this.logger.error(
          `Failed to update translation in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (environmentsData.length > 0) {
      return {
        language: input.language,
        className: input.className,
        property: input.property,
        key: input.key,
        availableEnvironments,
        environments: environmentsData,
        ...(failedEnvironments.length > 0 && { failedEnvironments }),
      }
    }

    throw new Error('Failed to update translation in all environments')
  }

  async deleteTranslation(
    user: User,
    input: TranslationKeyInput,
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
          api.meTranslationsControllerDeleteRaw({
            language: input.language,
            className: input.className,
            property: input.property,
            key: input.key,
            deleteTranslationDto: {
              environments: [environment],
            },
          }),
        )
        deletedEnvironments.push(environment)
      } catch (error) {
        this.logger.error(
          `Failed to delete translation in ${environment}`,
          error as Error,
        )
        failedEnvironments.push(toFailure(environment, error))
      }
    }

    if (deletedEnvironments.length === 0) {
      throw new Error('Failed to delete translation in all environments')
    }

    return {
      success: failedEnvironments.length === 0,
      affectedEnvironments: deletedEnvironments,
      ...(failedEnvironments.length > 0 && { failedEnvironments }),
    }
  }
}

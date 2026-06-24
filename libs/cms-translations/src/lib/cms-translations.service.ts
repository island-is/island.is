import { Inject, Injectable, Optional } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache as CacheManager } from 'cache-manager'
import { CmsTranslationConfig } from './cms-translations.config'
import { ConfigType } from '@nestjs/config'
import { Features } from '@island.is/feature-flags'
import { logger } from '@island.is/logging'
import { ContentfulRepository } from '@island.is/cms'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { Locale } from '@island.is/shared/types'

import { getApplicationTranslationCacheKey } from './application-translation.cache'

export type TranslationsDict = Record<string, string>

export const APPLICATION_TRANSLATION_PROVIDER =
  'APPLICATION_TRANSLATION_PROVIDER'

export interface ApplicationTranslationProvider {
  getTranslationsForNamespace(
    namespace: string,
    locale: Locale,
  ): Promise<Record<string, string>>
  isApplicationNamespace(namespace: string): boolean
}

interface Messages {
  id: string
  is: Record<string, string>
  en: Record<string, string>
}

interface NamespaceFields {
  namespace: string
  strings?: Record<string, any>
  defaults?: Record<string, any>
  fallback?: Record<string, any>
}

const DEFAULT_LOCALE = 'is-IS'

// Declare fallbacks for locales here since they are not set in Contentful for various reasons,
// this can be replaced by fetching Contentful locales if fallback is set in the future, same format.
const locales = [
  { code: DEFAULT_LOCALE, locale: 'is', fallbackCode: null },
  { code: 'en', locale: 'en', fallbackCode: DEFAULT_LOCALE },
]

const errorHandler = (name: string) => {
  return (error: Error) => {
    logger.error(error)
    throw new ApolloError(`Failed to resolve request in ${name}`)
  }
}

@Injectable()
export class CmsTranslationsService {
  constructor(
    private contentfulRepository: ContentfulRepository,
    @Inject(CmsTranslationConfig.KEY)
    private readonly config: ConfigType<typeof CmsTranslationConfig>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,
    private readonly featureFlagService: FeatureFlagService,
    @Optional()
    @Inject(APPLICATION_TRANSLATION_PROVIDER)
    private readonly appTranslationProvider?: ApplicationTranslationProvider,
  ) {}

  private shouldUseApplicationTranslationWorkspace = async (
    namespace: string,
  ): Promise<boolean> => {
    if (
      !this.appTranslationProvider ||
      !this.appTranslationProvider.isApplicationNamespace(namespace)
    ) {
      return false
    }

    return this.featureFlagService.getValue(
      Features.applicationTranslationsFromWorkspace,
      false,
    )
  }

  invalidateApplicationTranslationCache = async (
    namespace: string,
  ): Promise<void> => {
    await this.cacheManager.del(getApplicationTranslationCacheKey(namespace))
  }

  private getNamespaceMessagesFromDb = async (
    namespace: string,
    lang: Locale,
  ): Promise<Messages> => {
    const cacheKey = getApplicationTranslationCacheKey(namespace)
    const cache = await this.cacheManager.get(cacheKey)
    if (cache) {
      return cache as Messages
    }

    const isStrings =
      await this.appTranslationProvider!.getTranslationsForNamespace(
        namespace,
        'is',
      )
    const enStrings =
      await this.appTranslationProvider!.getTranslationsForNamespace(
        namespace,
        'en',
      )

    const messages: Messages = {
      id: namespace,
      is: isStrings,
      en: enStrings,
    }

    await this.cacheManager.set(
      cacheKey,
      messages,
      this.config.memCacheExpiryMilliseconds + 120000 * Math.random(),
    )

    return messages
  }

  getNamespaceMessages = async (namespace: string) => {
    if (await this.shouldUseApplicationTranslationWorkspace(namespace)) {
      return this.getNamespaceMessagesFromDb(namespace, 'is')
    }

    const cache = await this.cacheManager.get(namespace)
    if (cache) {
      return cache as Messages
    } else {
      const results = await this.contentfulRepository
        .getLocalizedEntries<NamespaceFields>('*', {
          ['content_type']: 'namespace',
          select: 'fields.strings',
          'fields.namespace': namespace,
        })
        .catch(errorHandler('getNamespace'))
      const messages = {
        id: namespace,
        is: {},
        en: {},
      } as Messages
      for (const item of results.items) {
        const strings = item.fields.strings ?? {}
        const defaultStrings = strings[DEFAULT_LOCALE] ?? {}
        for (const contentfulLocale of Object.keys(strings)) {
          const locale = locales.find((item) => item.code === contentfulLocale)!
            .locale as Locale
          const localeStrings = strings[contentfulLocale] ?? {}
          for (const key of Object.keys(strings[contentfulLocale])) {
            messages[locale][key] = localeStrings[key] || defaultStrings[key]
          }
        }
      }
      await this.cacheManager.set(
        namespace,
        messages,
        this.config.memCacheExpiryMilliseconds + 120000 * Math.random(),
      )

      return messages
    }
  }

  groupMessages = (
    messages: Messages[],
    { namespaces, lang }: { namespaces: string[]; lang: Locale },
  ) =>
    namespaces.reduce(
      (acc, cur) => ({
        ...acc,
        ...messages.find((m) => m.id === cur)?.[lang],
      }),
      {},
    )

  getTranslations = async (
    namespaces: string[],
    lang: Locale,
  ): Promise<TranslationsDict> => {
    const messages = await Promise.all(
      namespaces.map(
        async (namespace) => await this.getNamespaceMessages(namespace),
      ),
    )

    return this.groupMessages(messages, { namespaces, lang })
  }
}

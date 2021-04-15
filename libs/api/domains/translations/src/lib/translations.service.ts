import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ContentfulRepository } from '@island.is/api/domains/cms'
import { Locale } from '@island.is/shared/types'
import { ApolloError } from 'apollo-server-express'
import memoize from 'memoizee'
import { EntryCollection } from 'contentful'

export type TranslationsDict = Record<string, string>

interface NamespaceFields {
  namespace?: string | undefined
  strings?: Record<string, any> | undefined
  defaults?: Record<string, any> | undefined
  fallback?: Record<string, any> | undefined
}

const MAX_AGE = 1000 * 60 * 15 // 15 minutes
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
export class TranslationsService {
  constructor(private contentfulRepository: ContentfulRepository) {}

  getOrRequest = memoize(
    async (namespace: string) =>
      await this.contentfulRepository
        .getLocalizedEntries<NamespaceFields>('*', {
          ['content_type']: 'namespace',
          select: 'fields.strings',
          'fields.namespace[in]': namespace,
        })
        .catch(errorHandler('getNamespace')),
    { maxAge: MAX_AGE, preFetch: true },
  )

  getMessages = async (entries: EntryCollection<NamespaceFields>[]) => {
    let messages: Record<string, TranslationsDict> = {}

    for (const namespace of entries) {
      for (const item of namespace.items) {
        const strings = item.fields.strings

        if (!strings) {
          continue
        }

        for (const contentfulLocale of Object.keys(strings)) {
          const locale = locales.find((item) => item.code === contentfulLocale)!
            .locale as Locale

          for (const key of Object.keys(strings[contentfulLocale])) {
            const message =
              contentfulLocale === DEFAULT_LOCALE
                ? strings?.[contentfulLocale]?.[key]
                : strings?.[contentfulLocale]?.[key] !== ''
                ? strings?.[contentfulLocale]?.[key]
                : strings?.[DEFAULT_LOCALE]?.[key]

            messages = {
              ...messages,
              [locale]: {
                ...messages[locale],
                [key]: message,
              },
            }
          }
        }
      }
    }

    return messages
  }

  getTranslations = async (
    namespaces: string[],
    lang: Locale,
  ): Promise<TranslationsDict> => {
    const results = await Promise.all(
      namespaces.map(async (namespace) => await this.getOrRequest(namespace)),
    )
    const messages = await this.getMessages(results)

    return messages[lang]
  }
}

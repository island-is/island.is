import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ContentfulRepository } from '@island.is/api/domains/cms'
import { Locale } from '@island.is/shared/types'
import { ApolloError } from 'apollo-server-express'
import memoize from 'memoizee'

export type TranslationsDict = Record<string, string>

interface Messages {
  id: string
  is: Record<string, string>
  en: Record<string, string>
}

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

  getNamespaceMessages = memoize(
    async (namespace: string) => {
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
        for (const contentfulLocale of Object.keys(item.fields.strings ?? {})) {
          const strings = item.fields.strings

          if (!strings) {
            continue
          }

          for (const key of Object.keys(strings[contentfulLocale])) {
            const locale = locales.find(
              (item) => item.code === contentfulLocale,
            )!.locale as Locale

            if (contentfulLocale === DEFAULT_LOCALE) {
              messages[locale][key] = strings?.[contentfulLocale]?.[key]
            } else {
              messages[locale][key] =
                strings?.[contentfulLocale]?.[key] !== ''
                  ? strings?.[contentfulLocale]?.[key]
                  : strings?.[DEFAULT_LOCALE]?.[key]
            }
          }
        }
      }

      return messages
    },
    { maxAge: MAX_AGE, preFetch: true },
  )

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

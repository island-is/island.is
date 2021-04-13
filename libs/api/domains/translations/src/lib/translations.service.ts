import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ContentfulRepository, localeMap } from '@island.is/api/domains/cms'
import { Locale } from '@island.is/shared/types'
import { ApolloError } from 'apollo-server-express'
import isEmpty from 'lodash/isEmpty'
import mergeWith from 'lodash/mergeWith'

export interface TranslationsDict {
  [key: string]: string
}

interface NamespaceFields {
  namespace?: string | undefined
  strings?: Record<string, any> | undefined
  defaults?: Record<string, any> | undefined
  fallback?: Record<string, any> | undefined
}

// Declare fallbacks for locales here since they are not set in Contentful for various reasons,
// this can be replaced by fetching Contentful locales if fallback is set in the future, same format.
const locales = [
  { code: 'is-IS', fallbackCode: null },
  { code: 'en', fallbackCode: 'is-IS' },
]

const errorHandler = (name: string) => {
  return (error: Error) => {
    logger.error(error)
    throw new ApolloError(`Failed to resolve request in ${name}`)
  }
}

@Injectable()
export class TranslationsService {
  loadedNamespaces = new Map<
    string,
    { id: Locale; messages: TranslationsDict }[]
  >()
  fetching: Record<string, boolean> = {}

  constructor(private contentfulRepository: ContentfulRepository) {}

  getTranslations = async (
    namespaces?: string[],
    lang?: Locale,
  ): Promise<TranslationsDict> => {
    const locale = locales.find((l) => l.code === localeMap[lang ?? 'is']) as {
      code: string
      fallbackCode: string | null
    }

    if (!namespaces || !lang) {
      throw new Error('No namespaces or lang defined.')
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<NamespaceFields>('*', {
        ['content_type']: 'namespace',
        select: 'fields.strings',
        'fields.namespace[in]': namespaces.join(','),
      })
      .catch(errorHandler('getNamespace'))

    return result.items.reduce((acc: TranslationsDict, cur) => {
      const strings = cur.fields.strings

      return {
        ...acc,
        ...mergeWith(
          {},
          locale.fallbackCode ? strings?.[locale.fallbackCode] : {},
          strings?.[locale.code],
          (o, s) => (isEmpty(s) ? o : s),
        ),
      }
    }, {})
  }

  fetchNamespaces = async (namespaces: string[]) => {
    await Promise.all(
      namespaces.map(async (namespace) => {
        if (this.fetching?.[namespace]) {
          return
        }

        this.fetching[namespace] = true

        if (this.loadedNamespaces.has(namespace)) {
          logger.info(`${namespace} already exists.`)

          return
        }

        const isMessages = await this.getTranslations([namespace], 'is')
        const enMessages = await this.getTranslations([namespace], 'en')

        this.loadedNamespaces.set(namespace, [
          { id: 'is', messages: isMessages },
          { id: 'en', messages: enMessages },
        ])

        this.fetching[namespace] = false
      }),
    )
  }
}

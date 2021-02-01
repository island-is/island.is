import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { ContentfulRepository, localeMap } from '@island.is/api/domains/cms'
import isEmpty from 'lodash/isEmpty'
import mergeWith from 'lodash/mergeWith'

export interface TranslationsDict {
  [key: string]: string
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
  constructor(private contentfulRepository: ContentfulRepository) {}

  getTranslations = async (
    namespaces?: string[],
    lang?: string,
  ): Promise<TranslationsDict | null> => {
    const locale = locales.find((l) => l.code === localeMap[lang])

    const result = await this.contentfulRepository
      .getLocalizedEntries<any>('*', {
        ['content_type']: 'namespaceJeremyDev',
        select: 'fields.strings',
        'fields.namespace[in]': namespaces.join(','),
      })
      .catch(errorHandler('getNamespace'))

    return result.items.reduce((acc, cur) => {
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
}

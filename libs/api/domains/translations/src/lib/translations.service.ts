import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { ContentfulRepository, localeMap } from '@island.is/api/domains/cms'
import { isEmpty, mergeWith } from 'lodash'

// Declare fallbacks for locales here since they are not set in Contentful for various reasons,
// this can be replaced by fetching contentful locales if fallback is set in the future, same format.
const locales = [
  { code: 'is-IS', fallbackCode: null },
  { code: 'en', fallbackCode: 'is-IS' },
]

export interface TranslationsDict {
  [key: string]: string
}

const errorHandler = (name: string) => {
  return (error: Error) => {
    logger.error(error)
    throw new ApolloError('Failed to resolve request in ' + name)
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
        ['content_type']: 'namespace',
        select: 'fields.strings,fields.fallback',
        'fields.namespace[in]': namespaces.join(','),
      })
      .catch(errorHandler('getNamespace'))

    const withFallbacks = result?.items?.map(({ fields }) => {
      console.log('fields', fields)
      return mergeWith(
        {},
        locale.fallbackCode ? fields.strings[locale.fallbackCode] : {},
        fields.strings[locale.code],
        (o, s) => (isEmpty(s) ? o : s),
      )
    })

    return withFallbacks.reduce((obj, cur) => Object.assign(obj, cur), {})
  }
}

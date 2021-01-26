import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { ContentfulRepository, localeMap } from '@island.is/api/domains/cms'
import isEmpty from 'lodash/isEmpty'

interface DictArray {
  id: string
  defaultMessage: string
  'is-IS': string
  en: string
}

export interface TranslationsDict {
  [key: string]: string
}

// Declare fallbacks for locales here since they are not set in Contentful for various reasons,
// this can be replaced by fetching contentful locales if fallback is set in the future, same format.
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
      .getLocalizedEntries<any>('is-IS', {
        ['content_type']: 'namespaceJeremyDev', // TODO: replace after review
        select: 'fields.strings',
        'fields.namespace[in]': namespaces.join(','),
      })
      .catch(errorHandler('getNamespace'))

    return (
      result?.items?.map(({ fields }) =>
        fields.strings.reduce(
          (acc: Record<string, string>, cur: DictArray) => ({
            ...acc,
            [cur.id]: isEmpty(cur[locale.code])
              ? cur?.[locale.fallbackCode]
              : cur?.[locale.code],
          }),
          {},
        ),
      )?.[0] ?? null
    )
  }
}

import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { ContentfulRepository } from 'libs/api/domains/cms/src/lib/contentful.repository'

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
    const result = await this.contentfulRepository
      .getLocalizedEntries<any>(lang, {
        ['content_type']: 'translationStrings',
        'fields.namespace[in]': namespaces?.join(','),
      })
      .catch(errorHandler('getNamespace'))

    return (
      result?.items?.reduce(
        (arr, { fields }) => ({
          ...arr,
          ...fields.strings,
        }),
        {},
      ) ?? {}
    )
  }
}

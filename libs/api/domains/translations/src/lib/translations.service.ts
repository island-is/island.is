import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { ContentfulRepository } from '@island.is/api/domains/cms'
import { isEmpty, mergeWith } from 'lodash'

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
        ['content_type']: 'namespace',
        select: 'fields.strings,fields.fallback',
        'fields.namespace[in]': namespaces.join(','),
      })
      .catch(errorHandler('getNamespace'))

    const withFallbacks = result?.items?.map(({ fields }) =>
      mergeWith({}, fields.fallback, fields.strings, (o, s) =>
        isEmpty(s) ? o : s,
      ),
    )

    return withFallbacks.reduce((obj, cur) => Object.assign(obj, cur), {})
  }
}

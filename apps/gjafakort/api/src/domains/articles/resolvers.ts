import { logger } from '@island.is/logging'

import { Resolvers } from '../../types'
import { getLocalizedEntries } from '../../services/contentful'
import { RawArticle } from './types'
import { processArticleResponse } from './utils'

const resolvers: Resolvers = {
  Query: {
    async article(_, { lang, id }) {
      try {
        const result: RawArticle | null = await getLocalizedEntries(lang, {
          select:
            'fields.id,fields.title,fields.description,fields.ctaLabel,fields.ctaUrl,fields.content',
          // eslint-disable-next-line
          content_type: 'article',
          'fields.id': id,
        })
        return processArticleResponse(result)
      } catch (e) {
        logger.error(`Could not process article response ${e.message}`)
        return null
      }
    },
  },
}

export default resolvers

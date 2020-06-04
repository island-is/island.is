import { logger } from '@island.is/logging'

import { Resolvers } from '../../types'
import { getLocalizedEntries } from '../../services/contentful'
import { RawForm } from './types'
import { processFormResponse } from './utils'

const resolvers: Resolvers = {
  Query: {
    async form(_, { lang, id }) {
      try {
        const result: RawForm | null  = await getLocalizedEntries(lang, {
          select:
            'fields.id,fields.title,fields.description,fields.steps,fields.postFlowContent',
          // eslint-disable-next-line
          content_type: 'form',
          'fields.id': id,
          include: 6,
        })
        return processFormResponse(result)
      } catch (e) {
        logger.error(`Could not process form response ${e.message}`)
        return null
      }
    },
  },
}

export default resolvers

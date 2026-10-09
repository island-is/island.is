import { GraphQLError } from 'graphql'

import type { Logger } from '@island.is/logging'

export const handleError = (logger: Logger, error: unknown): never => {
  logger.error(error)

  throw new GraphQLError('Failed to resolve request', {
    extensions: { code: error instanceof Error ? error.message : undefined },
  })
}

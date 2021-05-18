import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

const handleError = (error: any) => {
  logger.error(error)

  throw new ApolloError(
    'Failed to resolve request',
    error?.message ?? error?.response?.message,
  )
}
@Injectable()
export class NationalRegistryXRoadService {}

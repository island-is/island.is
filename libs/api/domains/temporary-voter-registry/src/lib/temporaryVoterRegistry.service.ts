import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import {
  TemporaryVoterRegistryApi,
  VoterRegistryControllerFindOneRequest,
} from '../../gen/fetch/apis/TemporaryVoterRegistryApi'

const handleError = async (error: any) => {
  logger.error(JSON.stringify(error))

  if (error.json) {
    const json = await error.json()

    logger.error(json)

    throw new ApolloError(JSON.stringify(json), error.status)
  }

  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class TemporaryVoterRegistryService {
  constructor (
    private readonly temporaryVoterRegistryApi: TemporaryVoterRegistryApi,
  ) {}

  async temporaryVoterRegistryControllerFindOne (
    input: VoterRegistryControllerFindOneRequest,
  ) {
    return await this.temporaryVoterRegistryApi
      .voterRegistryControllerFindOne(input)
      .catch(handleError)
  }
}

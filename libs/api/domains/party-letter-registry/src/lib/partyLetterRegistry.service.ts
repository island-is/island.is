import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import {
  PartyLetterRegistryApi,
  PartyLetterRegistryControllerFindByManagerRequest,
} from '../../gen/fetch/apis'
import { CreateDto } from '../../gen/fetch'

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
export class PartyLetterRegistryService {
  constructor(
    private readonly partyLetterRegistryApi: PartyLetterRegistryApi,
  ) {}

  async partyLetterRegistryControllerCreate(input: CreateDto) {
    return await this.partyLetterRegistryApi
      .partyLetterRegistryControllerCreate({ createDto: input })
      .catch(handleError)
  }

  async partyLetterRegistryControllerFindByManager(
    input: PartyLetterRegistryControllerFindByManagerRequest,
  ) {
    return await this.partyLetterRegistryApi
      .partyLetterRegistryControllerFindByManager(input)
      .catch(handleError)
  }
}

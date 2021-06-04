import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import {
  TemporaryVoterRegistryApi,
  VoterRegistryControllerFindOneRequest,
} from '../../gen/fetch/apis'

@Injectable()
export class TemporaryVoterRegistryService {
  constructor(
    private readonly temporaryVoterRegistryApi: TemporaryVoterRegistryApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private async handleError(error: any) {
    this.logger.error(JSON.stringify(error))

    if (error.json) {
      const json = await error.json()
      this.logger.error(json)
      throw new ApolloError(JSON.stringify(json), error.status)
    }

    throw new ApolloError('Failed to resolve request', error.status)
  }

  async temporaryVoterRegistryControllerFindOne(
    input: VoterRegistryControllerFindOneRequest,
  ) {
    return await this.temporaryVoterRegistryApi
      .voterRegistryControllerFindOne(input)
      .catch(this.handleError)
  }
}

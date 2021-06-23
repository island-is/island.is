import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import {
  PartyLetterRegistryApi,
  PartyLetterRegistryControllerFindByManagerRequest,
} from '../../gen/fetch/apis'
import { CreateDto } from '../../gen/fetch'

@Injectable()
export class PartyLetterRegistryService {
  constructor(
    private readonly partyLetterRegistryApi: PartyLetterRegistryApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}
  private async handleError(error: any): Promise<never> {
    this.logger.error(JSON.stringify(error))

    if (error.json) {
      const json = await error.json()
      this.logger.error(json)
      throw new ApolloError(JSON.stringify(json), error.status)
    }

    throw new ApolloError('Failed to resolve request', error.status)
  }

  async partyLetterRegistryControllerCreate(input: CreateDto) {
    return await this.partyLetterRegistryApi
      .partyLetterRegistryControllerCreate({ createDto: input })
      .catch(this.handleError)
  }

  async partyLetterRegistryControllerFindByManager(
    input: PartyLetterRegistryControllerFindByManagerRequest,
  ) {
    return await this.partyLetterRegistryApi
      .partyLetterRegistryControllerFindByManager(input)
      .catch(this.handleError.bind(this))
  }
}

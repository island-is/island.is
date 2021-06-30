import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { PartyLetterRegistryApi } from '../../gen/fetch/apis'
import type { Logger } from '@island.is/logging'
import type { Auth, User } from '@island.is/auth-nest-tools'

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

  partyLetterRegistryApiWithAuth(auth: Auth) {
    return this.partyLetterRegistryApi.withMiddleware(new AuthMiddleware(auth))
  }

  async partyLetterRegistryControllerFindByManager(auth: User) {
    return await this.partyLetterRegistryApiWithAuth(auth)
      .partyLetterRegistryControllerFindAsManagerByAuth()
      .catch(this.handleError.bind(this))
  }
}

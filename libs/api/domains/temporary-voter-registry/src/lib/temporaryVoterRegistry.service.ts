import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { TemporaryVoterRegistryApi } from '../../gen/fetch/apis'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import type { Auth, User } from '@island.is/auth-nest-tools'

@Injectable()
export class TemporaryVoterRegistryService {
  constructor(
    private readonly temporaryVoterRegistryApi: TemporaryVoterRegistryApi,
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

  private temporaryVoterRegistryApiWithAuth(auth: Auth) {
    return this.temporaryVoterRegistryApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async temporaryVoterRegistryControllerFindByAuth(auth: User) {
    return await this.temporaryVoterRegistryApiWithAuth(auth)
      .voterRegistryControllerFindByAuth()
      .catch(this.handleError.bind(this))
  }
}

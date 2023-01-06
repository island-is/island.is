import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import { UsersApi } from '@island.is/clients/air-discount-scheme'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Flight as TFlight } from '@island.is/air-discount-scheme/types'


@Injectable()
export class FlightLegService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private usersApi: UsersApi,
  ) {}

  handleError(error: any): any {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  private handle4xx(error: FetchError) {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    this.handleError(error)
  }

  private getADSWithAuth(auth: Auth) {
    return this.usersApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async getThisYearsUserAndRelationsFlightLegs(
    auth: User,
  ): Promise<TFlight[]> {
    const getFlightsResponse = await this.getADSWithAuth(auth)
      .privateFlightUserControllerGetUserAndRelationsFlights()
      .catch((e) => {
        this.handle4xx(e)
      })

    if (!getFlightsResponse) {
      return []
    }

    // Type assertion from string unions becoming simply 'string' type 
    // in the openapi definition
    return getFlightsResponse as TFlight[]
  }
}

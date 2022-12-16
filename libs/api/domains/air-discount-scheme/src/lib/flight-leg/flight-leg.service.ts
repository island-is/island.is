import { Injectable } from '@nestjs/common'
import { AdminApi, FlightLeg } from '@island.is/clients/air-discount-scheme'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { FlightLegsInput } from './dto/flight-leg.input'
import { FetchError } from '@island.is/clients/middlewares'
import { ApolloError } from 'apollo-server-express'
import { Logger } from '@island.is/logging'

@Injectable()
export class FlightLegService {
  constructor(private adminApi: AdminApi, private logger: Logger) {}

  private getADSWithAuth(auth: Auth) {
    return this.adminApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  private handleError(error: any): any {
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

  async getFlightLegsByUser(
    auth: User,
    input: FlightLegsInput,
  ): Promise<FlightLeg[]> {
    const getFlightsResponse = await this.getADSWithAuth(auth)
      .privateFlightControllerGetUserFlights({ nationalId: input.nationalId })
      .catch((e) => {
        this.handle4xx(e)
      })

    if (!getFlightsResponse) {
      return []
    }
    const flightLegs: FlightLeg[] = []

    getFlightsResponse.forEach((flight) => {
      if (flight?.flightLegs) {
        flightLegs.push(...flight.flightLegs)
      }
    })

    return flightLegs
  }
}

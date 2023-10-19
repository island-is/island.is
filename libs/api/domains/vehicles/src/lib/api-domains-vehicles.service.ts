import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { Inject, Injectable } from '@nestjs/common'
import {
  VehicleSearchApi,
  BasicVehicleInformationGetRequest,
  PdfApi,
  VehicleSearchDto,
  PublicVehicleSearchApi,
  PersidnoLookupResultDto,
} from '@island.is/clients/vehicles'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
import { ApolloError } from 'apollo-server-express'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { basicVehicleInformationMapper } from '../utils/basicVehicleInformationMapper'
import { handle404 } from '@island.is/clients/middlewares'

/** Category to attach each log message to */
const LOG_CATEGORY = 'vehicles-service'

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(VehicleSearchApi) private vehiclesApi: VehicleSearchApi,
    @Inject(PdfApi) private vehiclesPDFApi: PdfApi,
    @Inject(PublicVehicleSearchApi)
    private publicVehiclesApi: PublicVehicleSearchApi,
  ) {}

  handleError(error: any, detail: string): ApolloError | null {
    this.logger.error(detail, {
      ...error,
      category: LOG_CATEGORY,
    })
    throw new Error(detail)
  }

  private getVehiclesWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private getPdfWithAuth(auth: Auth) {
    return this.vehiclesPDFApi.withMiddleware(new AuthMiddleware(auth))
  }
  async getVehiclesForUser(
    auth: User,
    showDeregistered: boolean,
    showHistory: boolean,
    nextCursor?: string,
  ): Promise<PersidnoLookupResultDto | undefined> {
    try {
      const res = await this.getVehiclesWithAuth(auth)
        .vehicleHistoryGet({
          requestedPersidno: auth.nationalId,
          showDeregistered: showDeregistered,
          showHistory: showHistory,
          cursor: nextCursor,
        })
        .catch(handle404)
      if (!res) {
        return {}
      }
      console.log('nextCursor', res.nextCursor)

      return res
    } catch (error) {
      this.handleError(error, 'Could not fetch vehicles for user')
    }
  }

  async getVehiclesSearch(
    auth: User,
    search: string,
  ): Promise<VehicleSearchDto | null | ApolloError> {
    try {
      const res = await this.getVehiclesWithAuth(auth).vehicleSearchGet({
        search,
      })
      const { data } = res
      if (!data) return null
      return data[0]
    } catch (error) {
      return this.handleError(error, 'Failed to get vehicle search')
    }
  }

  async getPublicVehicleSearch(search: string) {
    try {
      const data = await this.publicVehiclesApi.publicVehicleSearchGet({
        search,
      })
      return data
    } catch (error) {
      return this.handleError(error, 'Failet to get public vehicle search')
    }
  }

  async getSearchLimit(auth: User): Promise<number | null | ApolloError> {
    try {
      const res = await this.getVehiclesWithAuth(auth).searchesRemainingGet()
      if (!res) return null
      return res
    } catch (error) {
      return this.handleError(error, 'Failed to get vehicle search limit')
    }
  }

  async getVehicleDetail(
    auth: User,
    input: BasicVehicleInformationGetRequest,
  ): Promise<VehiclesDetail | null | ApolloError> {
    try {
      const res = await this.getVehiclesWithAuth(
        auth,
      ).basicVehicleInformationGet({
        clientPersidno: input.clientPersidno,
        permno: input.permno,
        regno: input.regno,
        vin: input.vin,
      })

      if (!res) return null

      return basicVehicleInformationMapper(res, auth.nationalId)
    } catch (error) {
      return this.handleError(error, 'Failed to get vehicle details')
    }
  }
}

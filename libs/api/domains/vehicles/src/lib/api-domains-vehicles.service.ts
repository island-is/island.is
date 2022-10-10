import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { Inject, Injectable } from '@nestjs/common'
import {
  VehicleSearchApi,
  BasicVehicleInformationGetRequest,
  PdfApi,
  VehicleSearchDto,
  PersidnoLookupDto,
} from '@island.is/clients/vehicles'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
import { ApolloError } from 'apollo-server-express'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { basicVehicleInformationMapper } from '../utils/basicVehicleInformationMapper'

/** Category to attach each log message to */
const LOG_CATEGORY = 'vehicles-service'

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(VehicleSearchApi)
    @Inject(PdfApi)
    private vehiclesApi: VehicleSearchApi,
    private vehiclesPDFApi: PdfApi,
  ) {}

  handleError(error: any, detail?: string): ApolloError | null {
    this.logger.error(detail || 'Vehicles error', {
      error: JSON.stringify(error),
      category: LOG_CATEGORY,
    })
    throw new ApolloError('Failed to resolve request', error.status)
  }

  private handle4xx(error: any, detail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, detail)
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
  ): Promise<PersidnoLookupDto | null | ApolloError> {
    try {
      const res = await this.getVehiclesWithAuth(auth).vehicleHistoryGet({
        requestedPersidno: auth.nationalId,
        showDeregistered: showDeregistered,
        showHistory: showHistory,
      })
      const { data } = res
      if (!data) return {}
      return data
    } catch (e) {
      return this.handle4xx(e, 'Failed to get vehicle list')
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
    } catch (e) {
      return this.handle4xx(e, 'Failed to get vehicle search')
    }
  }

  async getSearchLimit(auth: User): Promise<number | null | ApolloError> {
    try {
      const res = await this.getVehiclesWithAuth(auth).searchesRemainingGet()
      if (!res) return null
      return res
    } catch (e) {
      return this.handle4xx(e, 'Failed to get vehicle search limit')
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
    } catch (e) {
      return this.handle4xx(e, 'Failed to get vehicle details')
    }
  }
}

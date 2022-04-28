import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { Inject, Injectable } from '@nestjs/common'
import {
  VehiclesApi,
  BasicVehicleInformationGetRequest,
  BasicVehicleInformation,
  BasicVehicleInformationResult,
  PersidnoLookup,
  PersidnoLookupResult,
} from '@island.is/clients/vehicles'
import { GetVehiclesForUserInput } from '../dto/getVehiclesForUserInput'
import { UsersVehicles } from './api-domains-vehicles.type'

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(VehiclesApi)
    private vehiclesApi: VehiclesApi,
  ) {}

  async getVehiclesForUser(nationalId: string): Promise<PersidnoLookupResult> {
    const res = await this.vehiclesApi.vehicleHistoryGet({
      requestedPersidno: '2312892249',
    })
    console.log('REEES', { res })
    return res
  }

  async getVehicleDetail(
    input: BasicVehicleInformationGetRequest,
  ): Promise<BasicVehicleInformationResult> {
    return await this.vehiclesApi.basicVehicleInformationGet({
      clientPersidno: input.clientPersidno,
      permno: input.permno,
      regno: input.regno,
      vin: input.vin,
    })
  }
}

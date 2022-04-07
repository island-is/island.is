import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { Inject, Injectable } from '@nestjs/common'
import { VehiclesApi, RootGetRequest } from '@island.is/clients/vehicles'
import { GetVehiclesForUserInput } from '../dto/getVehiclesForUserInput'
import { UsersVehicles } from './api-domains-vehicles.type'

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(VehiclesApi)
    private VehicleApi: VehiclesApi,
  ) {}

  async getVehiclesForUser(nationalId: string): Promise<UsersVehicles> {
    return await this.VehicleApi.rootGet({ requestedPersidno: nationalId })
  }
}

import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Vehicles, GetVehiclesApi } from '@island.is/clients/skilavottord'

const isRunningInDevelopment = !(
  process.env.PROD_MODE === 'true' || process.env.NODE_ENV === 'production'
)

@Injectable()
export class SkilavottordRepository {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private getVehiclesApi: GetVehiclesApi,
  ) {
    this.logger.debug('Created Directorate of labour repository')
  }
  async getVehicles(nationalId: string): Promise<Vehicles[]> {

    const vehicles = await this.getVehiclesApi.applicationGetVehicles({nationalId})

    if (vehicles) {
      return vehicles
    }

    throw new Error('Could not fetch unions')
  }
}

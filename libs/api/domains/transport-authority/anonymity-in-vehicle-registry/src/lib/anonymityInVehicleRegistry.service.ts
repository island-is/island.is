import { Injectable } from '@nestjs/common'
import { VehicleInfolocksClient } from '@island.is/clients/transport-authority/vehicle-infolocks'

import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class AnonymityInVehicleRegistryApi {
  constructor(
    private readonly vehicleInfolocksClient: VehicleInfolocksClient,
  ) {}

  async getAnonymityStatus(user: User): Promise<Boolean> {
    const result = await this.vehicleInfolocksClient.getAnonymityStatus(user)
    return result.isValid
  }

  async setAnonymityStatus(user: User, isChecked: boolean): Promise<void> {
    await this.vehicleInfolocksClient.setAnonymityStatus(user, isChecked)
  }
}

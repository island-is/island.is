import { Injectable } from '@nestjs/common'
import {
  Operator,
  VehicleOperatorsClient,
} from '@island.is/clients/transport-authority/vehicle-operators'

@Injectable()
export class ChangeOperatorOfVehicleApi {
  constructor(
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
  ) {}

  async saveOperators(
    currentUserSsn: string,
    permno: string,
    newOperators: Operator[],
  ): Promise<void> {
    await this.vehicleOperatorsClient.saveOperators(
      currentUserSsn,
      permno,
      newOperators,
    )
  }
}

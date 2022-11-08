import { Injectable } from '@nestjs/common'
import {
  Operator,
  VehicleOperatorsClient,
} from '@island.is/clients/transport-authority/vehicle-operators'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class ChangeOperatorOfVehicleApi {
  constructor(
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
  ) {}

  async saveOperators(
    user: User,
    permno: string,
    newOperators: Operator[],
  ): Promise<void> {
    await this.vehicleOperatorsClient.saveOperators(user, permno, newOperators)
  }
}

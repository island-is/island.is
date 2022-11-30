import { Injectable } from '@nestjs/common'
import {
  VehiclePlateOrderingClient,
  PlateOrder,
  DeliveryStation,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class OrderVehicleLicensePlateApi {
  constructor(
    private readonly vehiclePlateOrderingClient: VehiclePlateOrderingClient,
  ) {}

  async getDeliveryStations(user: User): Promise<Array<DeliveryStation>> {
    return await this.vehiclePlateOrderingClient.getDeliveryStations(user)
  }

  async orderPlates(user: User, plateOrder: PlateOrder): Promise<void> {
    await this.vehiclePlateOrderingClient.orderPlates(user, plateOrder)
  }
}

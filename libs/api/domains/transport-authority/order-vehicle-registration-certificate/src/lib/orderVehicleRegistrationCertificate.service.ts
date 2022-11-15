import { Injectable } from '@nestjs/common'
import { VehiclePrintingClient } from '@island.is/clients/transport-authority/vehicle-printing'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class OrderVehicleRegistrationCertificateApi {
  constructor(private readonly vehiclePrintingClient: VehiclePrintingClient) {}

  async requestRegistrationCardPrint(
    user: User,
    permno: string,
  ): Promise<void> {
    await this.vehiclePrintingClient.requestRegistrationCardPrint(user, permno)
  }
}

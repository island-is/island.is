import { Injectable } from '@nestjs/common'
import { VehiclePrintingClient } from '@island.is/clients/transport-authority/vehicle-printing'

@Injectable()
export class OrderVehicleRegistrationCertificateApi {
  constructor(private readonly vehiclePrintingClient: VehiclePrintingClient) {}

  async RequestRegistrationCardPrint(permno: string): Promise<void> {
    this.vehiclePrintingClient.RequestRegistrationCardPrint(permno)
  }
}

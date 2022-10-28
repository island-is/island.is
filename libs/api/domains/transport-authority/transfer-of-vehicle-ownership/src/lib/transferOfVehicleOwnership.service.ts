import { Injectable } from '@nestjs/common'
import {
  OwnerChange,
  VehicleOwnerChangeClient,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import { User } from '@island.is/auth-nest-tools'
import {
  InsuranceCompany,
  VehicleCodetablesClient,
} from '@island.is/clients/transport-authority/vehicle-codetables'

@Injectable()
export class TransferOfVehicleOwnershipApi {
  constructor(
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly vehicleCodetablesClient: VehicleCodetablesClient,
  ) {}

  async getInsuranceCompanies(): Promise<InsuranceCompany[]> {
    return await this.vehicleCodetablesClient.getInsuranceCompanies()
  }

  async saveOwnerChange(
    currentUserSsn: string,
    ownerChange: OwnerChange,
  ): Promise<void> {
    await this.vehicleOwnerChangeClient.saveOwnerChange(
      currentUserSsn,
      ownerChange,
    )
  }
}

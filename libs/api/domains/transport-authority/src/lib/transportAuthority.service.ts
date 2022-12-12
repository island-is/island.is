import { Injectable } from '@nestjs/common'
import {
  InsuranceCompany,
  VehicleCodetablesClient,
} from '@island.is/clients/transport-authority/vehicle-codetables'

@Injectable()
export class TransportAuthorityApi {
  constructor(
    private readonly vehicleCodetablesClient: VehicleCodetablesClient,
  ) {}

  async getInsuranceCompanies(): Promise<InsuranceCompany[]> {
    return await this.vehicleCodetablesClient.getInsuranceCompanies()
  }
}

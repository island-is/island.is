import { Injectable } from '@nestjs/common'
import { CodeTableApi } from '../../gen/fetch/apis'
import { InsuranceCompany } from './vehicleCodetablesClient.types'

@Injectable()
export class VehicleCodetablesClient {
  constructor(private readonly codetablesApi: CodeTableApi) {}

  public async getInsuranceCompanies(): Promise<InsuranceCompany[]> {
    const result = await this.codetablesApi.insurancecompaniesGet({
      apiVersion: '1.0',
    })

    return result.map((item) => ({
      code: item.code,
      name: item.name,
    }))
  }
}

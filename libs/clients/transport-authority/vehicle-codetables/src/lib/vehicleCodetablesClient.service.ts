import { Injectable } from '@nestjs/common'
import { CodeTableApi } from '../../gen/fetch/apis'
import { InsuranceCompany } from './vehicleCodetablesClient.types'

@Injectable()
export class VehicleCodetablesClient {
  constructor(private readonly codetablesApi: CodeTableApi) {}

  public async getInsuranceCompanies(): Promise<InsuranceCompany[]> {
    // TODOx disabled untill this API goes on xroad
    return [
      { code: '001', name: 'VÍS', valid: true },
      { code: '002', name: 'Vörður', valid: true },
      { code: '003', name: 'TM', valid: true },
    ]

    const result = await this.codetablesApi.insurancecompaniesAllGet({})

    return result.map((item) => ({
      code: item.code,
      name: item.name,
      valid: item.valid == 1, //TODOx validate what item.valid looks like
    }))
  }
}

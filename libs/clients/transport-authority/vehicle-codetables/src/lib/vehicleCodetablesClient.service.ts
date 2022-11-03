import { Injectable } from '@nestjs/common'
import { CodeTableApi } from '../../gen/fetch/apis'
import { InsuranceCompany } from './vehicleCodetablesClient.types'

@Injectable()
export class VehicleCodetablesClient {
  constructor(private readonly codetablesApi: CodeTableApi) {}

  public async getInsuranceCompanies(): Promise<InsuranceCompany[]> {
    // TODOx disabled untill this API goes on xroad
    return [
      { code: '001', name: 'VÍS' },
      { code: '002', name: 'Vörður' },
      { code: '003', name: 'TM' },
    ]

    const result = await this.codetablesApi.insurancecompaniesGet({})

    return result.map((item) => ({
      code: item.code,
      name: item.name,
    }))
  }
}

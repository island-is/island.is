import { Inject, Injectable } from '@nestjs/common'
import { HealthInsuranceRESTAPI } from './rest'

@Injectable()
export class HealthInsuranceService {
  constructor(
    @Inject(HealthInsuranceRESTAPI)
    private healthInsuranceAPI: HealthInsuranceRESTAPI,
  ) {}

  // return true or false when asked if person is health insured
  async isHealthInsured(nationalId: string, date?: number): Promise<boolean> {
    return this.healthInsuranceAPI.isHealthInsured(nationalId, date)
  }
}

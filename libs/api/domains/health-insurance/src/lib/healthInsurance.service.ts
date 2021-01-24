import { Injectable, Inject } from '@nestjs/common'

import { HealthTest } from './graphql/models'

import { HealthInsuranceAPI } from './soap'

@Injectable()
export class HealthInsuranceService {
  constructor(
    private healthInsuranceAPI: HealthInsuranceAPI
    ) {}

  async getTest(nationalId: string): Promise<HealthTest> {
    const healthTest = new HealthTest()
    healthTest.nationalId = nationalId
    healthTest.fullName = 'working'
    return healthTest
  }

  getProfun(): Promise<string>{
    return this.healthInsuranceAPI.getProfun()
  }

  isHealthInsured(nationalId: string): Promise<boolean>{
    return this.healthInsuranceAPI.isHealthInsured(nationalId)
  }
  
}

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

  async isHealthInsured(nationalId: string): Promise<boolean>{
    const res = await this.healthInsuranceAPI.isHealthInsured(nationalId)
    console.log(res)
    console.log(`sjukratryggdur: ${res.sjukratryggdur}`)
    console.log(`radnumer: ${res.radnumer_si}`)
    console.log(`bidTima: ${res.a_bidtima}`)
    return Promise.resolve(res['sjukratryggdur'] == 1)
  }
}

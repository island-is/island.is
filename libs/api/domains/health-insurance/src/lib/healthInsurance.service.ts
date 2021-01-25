import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

import { HealthTest } from './graphql/models'
import { HealthInsuranceAPI } from './soap'

@Injectable()
export class HealthInsuranceService {
  constructor(private healthInsuranceAPI: HealthInsuranceAPI) {}

  async getTest(nationalId: string): Promise<HealthTest> {
    const healthTest = new HealthTest()
    healthTest.nationalId = nationalId
    healthTest.fullName = 'working'
    return healthTest
  }

  getProfun(): Promise<string> {
    return this.healthInsuranceAPI.getProfun()
  }

  // return true or false when asked if person is health insured?
  async isHealthInsured(nationalId: string): Promise<boolean> {
    const res = await this.healthInsuranceAPI.isHealthInsured(nationalId)
    logger.info('--- Finished isHealthInsured api call ---')
    return res['SjukratryggdurType']['sjukratryggdur'] == 1
  }
}

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
    logger.info(`--- Finished isHealthInsured api call for ${nationalId} ---`)
    return res.SjukratryggdurType.sjukratryggdur == 1
  }

  // return caseIds array with Pending status
  async getPendingApplication(nationalId: string): Promise<number[]> {
    const res = await this.healthInsuranceAPI.getApplication(nationalId)
    if (!res.FaUmsoknSjukratryggingType?.umsoknir) {
      logger.info(`return empty array to graphQL`)
      return []
    }

    logger.info(`Start filtering Pending status`)
    // Return all caseIds with Pending status
    const pendingCases: number[] = []
    // res.FaUmsoknSjukratryggingType.umsoknir[0].stada = 2
    res.FaUmsoknSjukratryggingType.umsoknir
      .filter((umsokn) => {
        return umsokn.stada == 2
      })
      .forEach((value) => {
        pendingCases.push(value.skjalanumer)
      })

    logger.info(`--- Finished getApplication api call for ${nationalId} ---`)
    return pendingCases
  }
}

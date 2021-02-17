import { Injectable } from '@nestjs/common'

import { VistaSkjalModel } from './graphql/models'
import { HealthInsuranceAPI } from './soap'
import { VistaSkjalInput } from './types'

@Injectable()
export class HealthInsuranceService {
  constructor(private healthInsuranceAPI: HealthInsuranceAPI) {}

  getProfun(): Promise<string> {
    return this.healthInsuranceAPI.getProfun()
  }

  // return caseIds array with Pending status
  async getPendingApplication(nationalId: string): Promise<number[]> {
    return this.healthInsuranceAPI.getPendingApplication(nationalId)
  }

  // return true or false when asked if person is health insured?
  async isHealthInsured(nationalId: string): Promise<boolean> {
    return this.healthInsuranceAPI.isHealthInsured(nationalId)
  }

  // Apply for Health insurance ( number 570 is identify number for health insurance application)
  async applyInsurance(
    inputs: VistaSkjalInput,
  ): Promise<VistaSkjalModel> {
    return this.healthInsuranceAPI.applyInsurance(570, inputs)
  }
}

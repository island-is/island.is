import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

import { VistaSkjalModel } from './graphql/models'
import { HealthInsuranceAPI } from './soap'
import { VistaSkjalInput } from './types'
// import { ApplicationService } from '../../../application/src/lib/application.service'
// import { GetApplicationInput } from '../../../application/src/lib/dto/getApplication.input'

@Injectable()
export class HealthInsuranceService {
  constructor(private healthInsuranceAPI: HealthInsuranceAPI,
    // private applicationServe: ApplicationService
    ) {}

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

  async applyInsurance(inputs: VistaSkjalInput, auth: string): Promise<VistaSkjalModel>{
    // const res = this.applicationServe.findOne("balabala", auth)
    return this.healthInsuranceAPI.applyInsurance(570, inputs)
  }
}

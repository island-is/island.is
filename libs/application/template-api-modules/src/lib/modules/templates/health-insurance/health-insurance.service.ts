import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { transformApplicationToHealthInsuranceDTO } from './health-insurance.utils'
// import { HealthInsuranceService as HealthInsuranceServiceBackend } from '@island.is/api/domains/health-insurance'

@Injectable()
export class HealthInsuranceService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    // private healthInsuranceServiceBackend: HealthInsuranceServiceBackend,
  ) {}
  async sendApplication({ application }: TemplateApiModuleActionProps){
    console.log("---------- Application --------------")
    console.log(JSON.stringify(application, null, 2))
    const vistaSkjal = transformApplicationToHealthInsuranceDTO(application)
    console.log("-------------- Vistaskjal inputs --------------")
    console.log(JSON.stringify(vistaSkjal, null, 2))
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // await this.healthInsuranceServiceBackend.applyInsurance(vistaSkjal)
    console.log("Health-Insurance - Finished sendApplication")
  }
}

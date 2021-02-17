import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

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
    const vistaSkjal = transformApplicationToHealthInsuranceDTO(application)
    logger.debug("---------- Application --------------")
    logger.debug(JSON.stringify(application, null, 2))
    logger.debug("-------------- Vistaskjal inputs --------------")
    logger.debug(JSON.stringify(vistaSkjal, null, 2))
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // await this.healthInsuranceServiceBackend.applyInsurance(vistaSkjal)
    logger.debug("Health-Insurance - Finished sendApplication")
  }
}

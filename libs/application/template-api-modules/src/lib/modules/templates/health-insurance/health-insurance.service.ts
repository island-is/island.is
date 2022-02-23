import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { transformApplicationToHealthInsuranceDTO } from './health-insurance.utils'
import { HealthInsuranceAPI } from '@island.is/health-insurance'

@Injectable()
export class HealthInsuranceService {
  constructor(
    private healthInsuranceAPI: HealthInsuranceAPI,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async sendApplyHealthInsuranceApplication({
    application,
  }: TemplateApiModuleActionProps) {
    try {
      logger.info(
        `Start send Health Insurance application for ${application.id}`,
      )
      const applyInputs = transformApplicationToHealthInsuranceDTO(application)
      logger.info(`Finished transform Application to Health Insurance DTO`)

      const res = await this.healthInsuranceAPI.applyInsurance(
        570,
        applyInputs.attachmentNames,
        applyInputs.vistaskjal,
      )

      logger.info(`Finished send Health Insurance application`)
    } catch (error) {
      logger.error(
        `Send health insurance application failed because: ${JSON.stringify(
          error,
        )}`,
      )
      throw new Error(
        `Send health insurance application failed because: ${JSON.stringify(
          error,
        )}`,
      )
    }
  }
}

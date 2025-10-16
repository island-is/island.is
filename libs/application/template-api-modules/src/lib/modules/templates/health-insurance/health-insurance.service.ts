import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

import { TemplateApiModuleActionProps } from '../../../types'
import {
  insuranceToXML,
  transformApplicationToHealthInsuranceDTO,
  errorMapper,
} from './health-insurance.utils'
import {
  DocumentApi,
  PersonApi,
} from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core/messages'
import { S3Service } from '@island.is/nest/aws'

@Injectable()
export class HealthInsuranceService extends BaseTemplateApiService {
  constructor(
    private documentApi: DocumentApi,
    private personApi: PersonApi,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.HEALTH_INSURANCE)
  }

  // return true or false when asked if person is health insured
  async isHealthInsured(
    application: TemplateApiModuleActionProps,
  ): Promise<boolean> {
    const formattedDate = format(new Date(), 'yyyy-MM-dd', {
      locale: is,
    })

    try {
      const resp = await this.personApi.personIsHealthInsured({
        date: formattedDate,
        nationalID: application.auth.nationalId,
      })
      return resp.isHealthInsured === 1
    } catch (error) {
      logger.error('Error fetching health insurance data', error)
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary:
            coreErrorMessages.errorDataProviderHealthInsuranceCantBeReached,
        },
        500,
      )
    }
  }

  async sendApplyHealthInsuranceApplication({
    application,
  }: TemplateApiModuleActionProps) {
    logger.info(`Start send Health Insurance application for ${application.id}`)

    const inputs = transformApplicationToHealthInsuranceDTO(application)
    const xml = await insuranceToXML(
      inputs.vistaskjal,
      inputs.attachmentNames,
      this.s3Service,
    )

    try {
      await this.documentApi.documentPost({
        document: { doc: xml, documentType: 570 },
      })
    } catch (error) {
      if (error.status === 412) {
        error.status = 500
      }
      throw await errorMapper(error)
    }

    logger.info(`Finished send Health Insurance application`)
  }
}

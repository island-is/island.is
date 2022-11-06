import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

import { TemplateApiModuleActionProps } from '../../../types'
import {
  insuranceToXML,
  transformApplicationToHealthInsuranceDTO,
} from './health-insurance.utils'
import { DocumentApi, PersonApi } from '@island.is/clients/health-insurance-v2'
import { BucketService } from './bucket/bucket.service'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

@Injectable()
export class HealthInsuranceService extends BaseTemplateApiService {
  constructor(
    private documentApi: DocumentApi,
    private bucketService: BucketService,
    private personApi: PersonApi,
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
      return false
    }
  }

  async sendApplyHealthInsuranceApplication({
    application,
  }: TemplateApiModuleActionProps) {
    try {
      logger.info(
        `Start send Health Insurance application for ${application.id}`,
      )

      const inputs = transformApplicationToHealthInsuranceDTO(application)
      const xml = await insuranceToXML(
        inputs.vistaskjal,
        inputs.attachmentNames,
        this.bucketService,
      )

      await this.documentApi.documentPost({
        document: { doc: xml, documentType: 570 },
      })

      logger.info(`Finished send Health Insurance application`)
    } catch (error) {
      logger.error(`Send health insurance application failed`)
      throw new Error(`Send health insurance application failed`)
    }
  }
}

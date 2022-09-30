import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

import { TemplateApiModuleActionProps } from '../../../types'
import {
  insuranceToXML,
  transformApplicationToHealthInsuranceDTO,
} from './health-insurance.utils'
import { DocumentApi } from '@island.is/clients/health-insurance-v2'
import { BucketService } from './bucket/bucket.service'

@Injectable()
export class HealthInsuranceService {
  constructor(
    private documentApi: DocumentApi,
    private bucketService: BucketService,
  ) {}

  async sendApplyHealthInsuranceApplication({
    application,
  }: TemplateApiModuleActionProps) {
    try {
      logger.info(
        `Start send Health Insurance application for ${application.id}`,
      )

      logger.info(`Finished transform Application to Health Insurance DTO`)

      const inputs = transformApplicationToHealthInsuranceDTO(application)
      const xml = await insuranceToXML(
        inputs.vistaskjal,
        inputs.attachmentNames,
        this.bucketService,
      )

      console.log(xml)

      await this.documentApi
        .documentPost({
          document: { doc: xml, documentType: 570 },
        })
        .catch((x) => {
          console.log('ERRRRORRR ======== : ', x)
        })

      logger.info(`Finished send Health Insurance application`)
    } catch (error) {
      console.log('ERRRORRR::', error)
      logger.error(`Send health insurance application failed`)
      throw new Error(`Send health insurance application failed`)
    }
  }
}

// @Injectable()
// export class HealthInsuranceService {
//   constructor(
//     private healthInsuranceAPI: HealthInsuranceAPI,
//     private readonly sharedTemplateAPIService: SharedTemplateApiService,
//   ) {}

//   async sendApplyHealthInsuranceApplication({
//     application,
//   }: TemplateApiModuleActionProps) {
//     try {
//       logger.info(
//         `Start send Health Insurance application for ${application.id}`,
//       )
//       const applyInputs = transformApplicationToHealthInsuranceDTO(application)
//       logger.info(`Finished transform Application to Health Insurance DTO`)

//       await this.healthInsuranceAPI.applyInsurance(
//         570,
//         applyInputs.attachmentNames,
//         applyInputs.vistaskjal,
//       )

//       logger.info(`Finished send Health Insurance application`)
//     } catch (error) {
//       logger.error(`Send health insurance application failed`)
//       throw new Error(`Send health insurance application failed`)
//     }
//   }
// }

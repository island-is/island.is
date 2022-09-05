import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedTemplateApiService } from '../../shared'
import { generateAssignOtherSpouseApplicationEmail } from './emailGenerators/assignOtherSpouseEmail'

@Injectable()
export class MarriageConditionsSubmissionService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    const response = await this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      'AY110',
    )

    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async assignSpouse({ application, auth }: TemplateApiModuleActionProps) {
    /*const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }*/
    console.log('ASSIGN!!!')

    await this.sharedTemplateAPIService.sendEmail(
      generateAssignOtherSpouseApplicationEmail,
      application,
    )
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    console.log(application)
    // SUBMIT

    return { success: true }
  }
}

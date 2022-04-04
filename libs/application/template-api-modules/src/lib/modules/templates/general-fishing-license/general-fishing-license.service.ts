import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import { GeneralFishingLicenseAnswers } from '@island.is/application/templates/general-fishing-license'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class GeneralFishingLicenseService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    const answers = application.answers as GeneralFishingLicenseAnswers
    const chargeItemCode = getValueViaPath(
      answers,
      'fishingLicense.chargeType',
    ) as string

    if (!chargeItemCode) {
      throw new Error('charge item code missing')
    }

    const response = await this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      application.id,
      chargeItemCode,
    )

    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const paymentStatus = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (paymentStatus?.fulfilled !== true) {
      throw new Error(
        'Trying to submit General Fishing License application that has not been paid',
      )
    }

    return {
      success: true,
    }
  }
}

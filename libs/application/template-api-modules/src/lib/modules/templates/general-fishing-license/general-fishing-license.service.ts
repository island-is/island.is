import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import { Item } from '@island.is/clients/payment'

@Injectable()
export class GeneralFishingLicenseService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    // Create real charge

    const chargeItemCode = 'L5102'
    // const chargeItemCode = 'AY110'

    console.log('IM HERE!!!!!')

    console.log('AUTH: ', auth.authorization)
    console.log('ID: ', id)
    console.log('CHARGE ITEM CODE: ', chargeItemCode)

    const response = await this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      chargeItemCode,
    )

    console.log('Response from Service: ', response)

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

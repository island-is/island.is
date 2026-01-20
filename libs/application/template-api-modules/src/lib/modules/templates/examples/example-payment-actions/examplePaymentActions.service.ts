import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { getValueViaPath } from '@island.is/application/core'
import { CatalogItem } from '@island.is/clients/charge-fjs-v2'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicationTypes,
  InstitutionNationalIds,
} from '@island.is/application/types'

@Injectable()
export class ExamplePaymentActionsService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.EXAMPLE_PAYMENT)
  }

  async createCharge({
    application: { id, answers },
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    // Performing organization ID
    const SYSLUMADUR_NATIONAL_ID = InstitutionNationalIds.SYSLUMENN

    // This is where you'd pick and validate that you are going to create a charge for a
    // particular charge item code. Note that creating these charges creates an actual "krafa"
    // with FJS
    const chargeItemCode = getValueViaPath<CatalogItem['chargeItemCode']>(
      answers,
      'userSelectedChargeItemCode',
    )

    if (!chargeItemCode) {
      throw new Error('No selected charge item code')
    }

    const response = await this.sharedTemplateAPIService.createCharge(
      auth,
      id,
      SYSLUMADUR_NATIONAL_ID,
      [{ code: chargeItemCode }],
      undefined,
      currentUserLocale,
    )

    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async submitApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const paymentStatus = await this.sharedTemplateAPIService.getPaymentStatus(
      application.id,
    )

    if (paymentStatus?.fulfilled !== true) {
      throw new Error('trying to submit an application that has not been paid')
    }

    // Note: after this point, you can be asured that the payment has been made, so you can
    // safely do appropriate api calls at this point.

    return {
      success: true,
    }
  }
}

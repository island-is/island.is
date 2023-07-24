import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicationTypes,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  getChargeItemCodes,
  ResidencePermitPermanentAnswers,
} from '@island.is/application/templates/directorate-of-immigration/residence-permit-permanent'
import { ResidencePermitClient } from '@island.is/clients/directorate-of-immigration/residence-permit'

@Injectable()
export class ResidencePermitPermanentService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vesidencePermitClient: ResidencePermitClient,
  ) {
    super(ApplicationTypes.RESIDENCE_PERMIT_PERMANENT)
  }

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const answers = application.answers as ResidencePermitPermanentAnswers

      const chargeItemCodes = getChargeItemCodes(answers)

      const result = this.sharedTemplateAPIService.createCharge(
        auth,
        application.id,
        InstitutionNationalIds.UTLENDINGASTOFNUN,
        chargeItemCodes,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as ResidencePermitPermanentAnswers

    // Submit the application
    await this.vesidencePermitClient.submitApplicationForPermanent(auth)
  }
}

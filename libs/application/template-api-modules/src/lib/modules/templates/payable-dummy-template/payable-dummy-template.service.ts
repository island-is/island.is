import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { ChargeResult } from '@island.is/api/domains/payment'

interface Payment {
  chargeItemCode: string
  chargeItemName: string
  priceAmount: number
  performingOrgID: string
  chargeType: string
}

@Injectable()
export class PayableDummyTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService, //private readonly apiDomainsPaymentService: ApiDomainsPaymentService,
  ) {}

  async createCharge({
    application: { applicant, externalData, answers, id },
  }: TemplateApiModuleActionProps) {
    const payment = externalData.paymentCatalogProvider.data as Payment

    const chargeItem = {
      chargeItemCode: payment.chargeItemCode,
      quantity: 1,
      priceAmount: payment.priceAmount,
      amount: payment.priceAmount * 1,
      reference: 'Fullnaðarskírteini',
    }

    const result = await this.sharedTemplateAPIService
      .createCharge(
        {
          chargeType: payment.chargeType,
          charges: [chargeItem],
          payeeNationalID: applicant,
          // TODO: possibly somebody else, if 'umboð'
          performerNationalID: applicant,
          // TODO: sýslumannskennitala - rvk
          performingOrgID: payment.performingOrgID,
        },
        id,
      )
      .catch((e) => {
        console.error(e)

        return { error: e } as ChargeResult
      })

    if (result.error || !result.success) {
      throw new Error('Villa kom upp við að stofna til greiðslu')
    }

    console.log({ result })

    return result
  }
}

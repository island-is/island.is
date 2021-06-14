import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { ChargeResult } from '@island.is/api/domains/payment'
import { application } from 'express'

interface Payment {
  chargeItemCode: string,
  chargeItemName: string,
  priceAmount: number,
  performingOrgID: string,
  chargeType: string,
}

@Injectable()
export class PayableDummyTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    //private readonly apiDomainsPaymentService: ApiDomainsPaymentService,
  ) {}

  async createCharge({
    application: { applicant, externalData, answers, id },
  }: TemplateApiModuleActionProps) {
    console.log('==== creating charge ====')
    console.log({ externalData })
    console.log({ answers })

    const payment = (externalData.payment.data as Payment)

    const chargeItem = {
      chargeItemCode: payment.chargeItemCode,
      quantity: 1,
      priceAmount: payment.priceAmount,
      amount: payment.priceAmount * 1,
      reference: 'Fullnaðarskírteini',
    }

    const callbackUrl = `https://localhost:4200/umsoknir/okuskirteini/${id}`

    const result = await this.sharedTemplateAPIService
      .createCharge({
        // TODO: this needs to be unique, but can only handle 22 or 23 chars
        // should probably be an id or token from the DB charge once implemented
        chargeItemSubject: `${new Date().toISOString().substring(0, 19).replace(/[^0-9]/g, '')}`,
        chargeType: payment.chargeType,
        immediateProcess: true,
        charges: [
          chargeItem,
        ],
        payInfo: { payableAmount: chargeItem.amount },
        payeeNationalID: applicant,
        // TODO: possibly somebody else, if 'umboð'
        performerNationalID: applicant,
        // TODO: sýslumannskennitala - rvk
        performingOrgID: payment.performingOrgID,
        systemID: 'ISL',
        returnUrl: callbackUrl,
      }, `https://localhost:4200/umsoknir/okuskirteini/${id}`, id)
      .catch((e) => {
        console.error(e)

        return ({ error: e } as ChargeResult)
      })

    if (result.error || !result.success) {
      throw new Error('Villa kom upp við að stofna til greiðslu')
    }

    console.log({ result })

    return result
  }
}

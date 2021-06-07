import { Injectable } from '@nestjs/common'
import { Charge, PaymentAPI } from '@island.is/clients/payment'
import { ChargeResult } from './api-domains-payment.types'
import { application } from 'express'

@Injectable()
export class PaymentService {
  private baseUrl: string

  constructor(private readonly paymentApi: PaymentAPI) {
    this.baseUrl = 'https://uat.arkid.is'
  }

  private makePaymentUrl(docNum: string, returnUrl: string): string {
    return `${this.baseUrl}/quickpay/pay`
      + `?returnUrl=${encodeURIComponent(returnUrl)}`
      + `&doc_num=${docNum}`
  }

  async createCharge(chargeParameters: Charge, returnUrl: string): Promise<ChargeResult> {
    try {
      const charge = await this.paymentApi.createCharge(chargeParameters)

      return {
        success: true,
        error: null,
        data: {
          ...charge,
          paymentUrl: this.makePaymentUrl(charge.user4, returnUrl)
        },
      }
    } catch (e) {
      return {
        success: false,
        error: e,
      }
    }
  }
}

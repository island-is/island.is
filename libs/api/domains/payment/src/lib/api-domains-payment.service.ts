import { Injectable } from '@nestjs/common'
import { Charge, PaymentAPI } from '@island.is/clients/payment'
import { ChargeResult } from './api-domains-payment.types'

@Injectable()
export class PaymentService {
  private baseUrl: string

  constructor(private readonly paymentApi: PaymentAPI) {
    this.baseUrl = 'https://birtint.ebp.solutions'
  }

  private makePaymentUrl(docNum: string, returnUrl: string): string {
    return `${this.baseUrl}/quickpay/document/pay`
      + `?returnUrl=${encodeURIComponent(returnUrl)}`
      + `&doc_num=${docNum}`
  }

  async createCharge(chargeParameters: Charge): Promise<ChargeResult> {
    try {
      const charge = await this.paymentApi.createCharge(chargeParameters)

      console.log(charge)

      return {
        success: true,
        error: null,
        data: {
          ...charge,
          paymentUrl: this.makePaymentUrl(charge.user4, 'http://localhost:4200/umsoknir/okuskirteini/')
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

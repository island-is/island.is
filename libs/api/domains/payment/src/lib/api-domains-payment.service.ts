import { Injectable } from '@nestjs/common'
import { Charge, PaymentAPI } from '@island.is/clients/payment'
import { ChargeResult } from './api-domains-payment.types'

@Injectable()
export class ApiDomainsPaymentService {
  private baseUrl: string

  constructor(private readonly paymentApi: PaymentAPI) {
    this.baseUrl = 'https://uat.arkid.is'
  }

  private makePaymentUrl(docNum: string): string {
    return `${this.baseUrl}/quickpay/pay?doc_num=${docNum}`
  }

  async createCharge(chargeParameters: Charge): Promise<ChargeResult> {
    try {
      const charge = await this.paymentApi.createCharge(chargeParameters)

      return {
        success: true,
        error: null,
        data: {
          ...charge,
          paymentUrl: this.makePaymentUrl(charge.user4),
        },
      }
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      }
    }
  }
}

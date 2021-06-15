import { Inject, Injectable } from '@nestjs/common'
import { Charge, PaymentAPI, PAYMENT_OPTIONS } from '@island.is/clients/payment'
import { ChargeResult, PaymentServiceOptions } from './api-domains-payment.types'

@Injectable()
export class ApiDomainsPaymentService {
  private baseUrl: string

  constructor(
    private readonly paymentApi: PaymentAPI,
    @Inject(PAYMENT_OPTIONS)
    private readonly options: PaymentServiceOptions,
    ) {
    this.baseUrl = this.options.arkBaseUrl
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

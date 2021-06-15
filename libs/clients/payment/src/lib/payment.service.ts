import { Inject, Injectable } from '@nestjs/common'
import { BaseCharge, Charge, PaymentAPI } from '@island.is/clients/payment'
import { PaymentServiceOptions, PAYMENT_OPTIONS, ChargeResult } from './payment.type'

@Injectable()
export class PaymentService {
  private baseUrl: string
  constructor(
    @Inject(PAYMENT_OPTIONS)
    private readonly options: PaymentServiceOptions,
    @Inject(PaymentAPI)
    private readonly paymentAPI: PaymentAPI,
  ) {
    this.baseUrl = this.options.arkBaseUrl
  }

  private makePaymentUrl(docNum: string): string {
    return `${this.baseUrl}/quickpay/pay?doc_num=${docNum}`
  }

  async createPayment(
    baseCharge: BaseCharge,
    applicationId: string,
  ): Promise<ChargeResult> {
    // TODO: island.is x-road service path for callback.. ??
    // this can actually be a fixed url
    const callbackUrl = this.options.callbackBaseUrl + applicationId as string + this.options.callbackAdditionUrl
    const charge: Charge = {
      ...baseCharge,
      // TODO: this needs to be unique, but can only handle 22 or 23 chars
      // should probably be an id or token from the DB charge once implemented
      chargeItemSubject: `pay/${Date.now().toString(32)}`,
      immediateProcess: true,
      systemID: 'ISL',
      returnUrl: callbackUrl,
      payInfo: {
        RRN: '',
        cardType: '',
        paymentMeans: '',
        authCode: '',
        PAN: '',
        payableAmount: baseCharge.charges[0].amount
      }
    }
    try {
      const result = await this.paymentAPI.createCharge(charge)

      return {
        success: true,
        error: null,
        data: {
          ...result,
          paymentUrl: this.makePaymentUrl(result.user4),
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

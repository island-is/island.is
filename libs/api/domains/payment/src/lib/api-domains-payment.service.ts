import { Injectable } from '@nestjs/common'
import { Charge, PaymentAPI } from '@island.is/clients/payment'
import { ChargeResult } from './api-domains-payment.types'

@Injectable()
export class ApiDomainsPaymentService {
  private baseUrl: string

  constructor(private readonly paymentApi: PaymentAPI) {
    this.baseUrl = 'https://uat.arkid.is'
  }

  private makePaymentUrl(docNum: string, returnUrl: string): string {
    return `${this.baseUrl}/quickpay/document/pay`
      + `?returnUrl=${encodeURIComponent(returnUrl)}`
      + `&doc_num=${docNum}`
  }

  async createCharge(chargeParameters: Charge): Promise<ChargeResult> {
    console.log('apidomainssvc ' + JSON.stringify(chargeParameters, null, 4));
    try {
      console.log('inside try')
      const charge = await this.paymentApi.createCharge(chargeParameters)
      console.log(JSON.stringify(charge, null, 4));
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
        error: e as Error,
      }
    }
  }
}

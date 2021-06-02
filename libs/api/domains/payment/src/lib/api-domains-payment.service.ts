import { Injectable } from '@nestjs/common'
import { Charge, PaymentAPI } from '@island.is/clients/payment'
import { ChargeResult } from './api-domains-payment.types'

@Injectable()
export class PaymentService {
  constructor(private readonly paymentApi: PaymentAPI) {}

  async createCharge(chargeParameters: Charge): Promise<ChargeResult> {
    try {
      const charge = await this.paymentApi.createCharge(chargeParameters)

      console.log(charge)

      return {
        success: true,
        error: null,
        data: charge,
      }
    } catch (e) {
      return {
        success: false,
        error: e,
      }
    }
  }
}

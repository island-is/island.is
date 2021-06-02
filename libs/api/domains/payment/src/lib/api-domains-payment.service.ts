import { Inject, Injectable } from '@nestjs/common'
import { Charge, ChargeResponse, PaymentAPI, PAYMENT_OPTIONS } from '@island.is/clients/payment'

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentApi: PaymentAPI
  ) {}

  async createCharge(chargeParameters: Charge): Promise<ChargeResponse> {
    const charge = await this.paymentApi.createCharge(chargeParameters)

    console.log(charge)

    return charge
  }
}

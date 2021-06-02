import { Injectable } from '@nestjs/common'
import { Charge, ChargeResponse, PaymentAPI } from '@island.is/clients/payment'

@Injectable()
export class PaymentService {
  constructor(private paymentApi: PaymentAPI) {}

  async createCharge(chargeParameters: Charge): Promise<ChargeResponse> {
    const charge = await this.paymentApi.createCharge(chargeParameters)

    console.log(charge)

    return charge
  }
}

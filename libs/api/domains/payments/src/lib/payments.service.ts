import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

import { GetPaymentFlowInput } from './dto/getPaymentFlow.input'
import { PaymentsApi, GetPaymentFlowDTO } from '@island.is/clients/payments'

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsApi: PaymentsApi) {}

  getPaymentFlow(input: GetPaymentFlowInput): Promise<GetPaymentFlowDTO> {
    return this.paymentsApi.paymentFlowControllerGetPaymentInfo(input)
  }
}

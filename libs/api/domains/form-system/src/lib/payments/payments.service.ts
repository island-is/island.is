import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  PaymentCallbackApi,
  PaymentCallbackControllerApiClientPaymentCallbackRequest,
  PaymentCallbackControllerPaymentApprovedRequest,
  PaymentControllerGetPaymentStatusRequest,
  PaymentsApi,
} from '@island.is/clients/form-system'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  PaymentApprovedInput,
  PaymentCallbackInput,
  PaymentStatusInput,
} from '../../dto/payment.input'
import { PaymentStatusResponse } from '../../models/payment.model'

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private paymentsApi: PaymentsApi,
    private paymentCallbackApi: PaymentCallbackApi,
  ) {}

  private paymentsApiWithAuth(auth: User) {
    return this.paymentsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private paymentCallbackApiWithAuth(auth: User) {
    return this.paymentCallbackApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getPaymentStatus(
    auth: User,
    input: PaymentStatusInput,
  ): Promise<PaymentStatusResponse> {
    return await this.paymentsApiWithAuth(
      auth,
    ).paymentControllerGetPaymentStatus(
      input as PaymentControllerGetPaymentStatusRequest,
    )
  }

  async paymentCallback(
    auth: User,
    input: PaymentCallbackInput,
  ): Promise<void> {
    await this.paymentCallbackApiWithAuth(
      auth,
    ).paymentCallbackControllerApiClientPaymentCallback(
      input as PaymentCallbackControllerApiClientPaymentCallbackRequest,
    )
  }

  async paymentApprovedCallback(
    auth: User,
    input: PaymentApprovedInput,
  ): Promise<void> {
    await this.paymentCallbackApiWithAuth(
      auth,
    ).paymentCallbackControllerPaymentApproved(
      input as PaymentCallbackControllerPaymentApprovedRequest,
    )
  }
}

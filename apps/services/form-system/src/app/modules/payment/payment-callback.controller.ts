import { ApiClientCallback, Callback } from '@island.is/api/domains/payment'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { PaymentService } from './payment.service'

@ApiTags('payment-callback')
@Controller()
export class PaymentCallbackController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('application-payment/:applicationId/:id')
  async paymentApproved(
    @Body() callback: Callback,
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    if (callback.status !== 'paid') {
      return
    }
    await this.paymentService.fulfillPayment(
      id,
      callback.receptionID,
      applicationId,
    )
  }

  /**
   * Handles payment callback notifications from the API client for successful payments.
   *
   * @async
   * @param {ApiClientCallback} callback - The callback data from the payment system containing:
   *   - type: Type of callback ('success' or other)
   *   - details: Payment event details including charge information
   *   - paymentFlowMetadata: Metadata containing paymentId and applicationId
   *
   * @throws {Error} If no receptionId is found in a success callback
   *
   * @remarks
   * The function:
   * 1. For successful payments:
   *    - Extracts receptionId from callback
   *    - Fulfills the payment using paymentService
   * 2. Updates application pruning schedule:
   *    - Extends pruneAt date to one month from now
   *    - Default pruning is 24 hours, but paid applications are kept longer
   *    to handle potential error states
   *
   */
  @Post('form-payment/api-client-payment-callback/')
  async apiClientPaymentCallback(
    @Body() callback: ApiClientCallback,
  ): Promise<void> {
    if (callback.type === 'success') {
      if (!callback.paymentFlowMetadata.paymentId) {
        throw new BadRequestException('No paymentId found in success callback')
      }
      if (!callback.paymentFlowMetadata.applicationId) {
        throw new BadRequestException(
          'No applicationId found in success callback',
        )
      }
      if (!callback.details?.eventMetadata?.charge?.receptionId) {
        throw new BadRequestException(
          'No receptionId found in success callback',
        )
      }
      await this.paymentService.fulfillPayment(
        callback.paymentFlowMetadata.paymentId,
        callback.details?.eventMetadata?.charge?.receptionId ?? '',
        callback.paymentFlowMetadata.applicationId,
      )
    }
  }
}

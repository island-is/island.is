import { ApiClientCallback } from '@island.is/api/domains/payment'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApplicationsService } from '../applications/applications.service'
import { PaymentService } from './payment.service'

@ApiTags('payment-callback')
@Controller()
export class PaymentCallbackController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly applicationsService: ApplicationsService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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
   *
   */
  @Post('form-payment/api-client-payment-callback/')
  async apiClientPaymentCallback(
    @Body() callback: ApiClientCallback,
  ): Promise<void> {
    if (callback.type === 'success') {
      this.logger.info(
        `Received successful payment callback with data: paymentId=${callback.paymentFlowMetadata.paymentId}, applicationId=${callback.paymentFlowMetadata.applicationId}, receptionId=${callback.details?.eventMetadata?.charge?.receptionId}`,
      )
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

      const result = await this.applicationsService.submit(
        callback.paymentFlowMetadata.applicationId,
      )
      if (result.submissionFailed) {
        throw new InternalServerErrorException('Application submission failed')
      }

      await this.paymentService.fulfillPayment(
        callback.paymentFlowMetadata.paymentId,
        callback.details?.eventMetadata?.charge?.receptionId ?? '',
        callback.paymentFlowMetadata.applicationId,
      )
    }
  }
}

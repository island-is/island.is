import {
  Body,
  Controller,
  Param,
  Post,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common'
import { ApiClientCallback, Callback } from '@island.is/api/domains/payment'
import { PaymentService } from './payment.service'
import { ApplicationService } from '@island.is/application/api/core'
import { ApiTags } from '@nestjs/swagger'
import addMonths from 'date-fns/addMonths'

@ApiTags('payment-callback')
@Controller()
export class PaymentCallbackController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly applicationService: ApplicationService,
  ) {}

  @Post('application-payment/:applicationId/:id')
  async paymentApproved(
    @Body() callback: Callback,
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    if (callback.status !== 'paid') {
      // TODO: no-op.. it would be nice eventually to update all statuses
      return
    }
    await this.paymentService.fulfillPayment(
      id,
      callback.receptionID,
      applicationId,
    )

    const application = await this.applicationService.findOneById(applicationId)
    if (application) {
      const oneMonthFromNow = addMonths(new Date(), 1)
      //Applications payment states are default to be pruned in 24 hours.
      //If the application is paid, we want to hold on to it for longer in case we get locked in an error state.

      await this.applicationService.update(applicationId, {
        ...application,
        pruneAt: oneMonthFromNow,
      })
    }
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
  @Post('application-payment/api-client-payment-callback/')
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
      // if (!callback.details?.eventMetadata?.charge?.receptionId) {
      //   throw new BadRequestException(
      //     'No receptionId found in success callback',
      //   )
      // }
      await this.paymentService.fulfillPayment(
        callback.paymentFlowMetadata.paymentId,
        callback.details?.eventMetadata?.charge?.receptionId ?? '',
        callback.paymentFlowMetadata.applicationId,
      )

      const application = await this.applicationService.findOneById(
        callback.paymentFlowMetadata.applicationId,
      )
      if (application) {
        const oneMonthFromNow = addMonths(new Date(), 1)
        //Applications payment states are default to be pruned in 24 hours.
        //If the application is paid, we want to hold on to it for longer in case we get locked in an error state.

        await this.applicationService.update(
          callback.paymentFlowMetadata.applicationId,
          {
            ...application,
            pruneAt: oneMonthFromNow,
          },
        )
      }
    }
  }
}

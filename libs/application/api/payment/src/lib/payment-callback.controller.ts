import { Body, Controller, Param, Post, ParseUUIDPipe } from '@nestjs/common'
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

  @Post('application-payment/api-client-payment-callback/')
  async apiClientPaymentCallback(
    @Body() callback: ApiClientCallback,
  ): Promise<void> {
    console.log('--------------------------------')
    console.log('callback', JSON.stringify(callback, null, 2))
    console.log('--------------------------------')
    if (callback.type === 'success') {
      if (callback.details?.eventMetadata?.charge?.receptionId) {
        console.log('=========================================')
        console.log('fulfilling payment')
        console.log('=========================================')
        await this.paymentService.fulfillPayment(
          callback.paymentFlowMetadata.paymentId,
          callback.details?.eventMetadata?.charge?.receptionId ?? '',
          callback.paymentFlowMetadata.applicationId,
        )
      } else {
        throw new Error('No receptionId found in success callback')
      }
    }

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

import { Body, Controller, Param, Post, ParseUUIDPipe } from '@nestjs/common'
import type { Callback } from '@island.is/api/domains/payment'
import { PaymentService } from './payment.service'

@Controller()
export class PaymentCallbackController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('application-payment/:applicationId/:id')
  async paymentApproved(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() callback: Callback,
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
  }
}

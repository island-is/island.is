import { Body, Controller, Param, Post, ParseUUIDPipe } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import type { Callback } from '@island.is/api/domains/payment'

@Controller()
export class PaymentCallbackController {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}

  @Post('applicationPayment/:application_id/:id')
  async paymentApproved(
    @Param('application_id', new ParseUUIDPipe()) applicationId: string,
    @Body() callback: Callback,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    if (callback.status !== 'paid') {
      // TODO: no-op.. it would be nice eventually to update all statuses
      return
    }

    await this.paymentModel.update(
      {
        fulfilled: true,
      },
      {
        where: {
          id,
          application_id: applicationId,
        },
      },
    )
  }
}

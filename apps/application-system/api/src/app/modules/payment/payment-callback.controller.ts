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

  @Post('application-payment/:applicationId/:id')
  async paymentApproved(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() callback: Callback,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    // var applicationId = '235526dd-0433-44da-9945-4a2cb1a71587'
    // var id = '373adb06-2186-4098-a678-e7ee3968e314'
    if (callback.status !== 'paid') {
      // TODO: no-op.. it would be nice eventually to update all statuses
      return
    }
    await this.paymentModel.update(
      {
        fulfilled: true,
        reference_id: callback.receptionID,
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

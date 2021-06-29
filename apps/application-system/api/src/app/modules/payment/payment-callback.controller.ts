import {
  Body,
  Controller,
  Param,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ApiParam, ApiTags, ApiHeader } from '@nestjs/swagger'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import type { Callback } from '@island.is/api/domains/payment'

@ApiTags('payments-callback')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@ApiHeader({
  name: 'locale',
  description: 'Front-end language selected',
})
@Controller()
export class PaymentCallbackController {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}

  @Post('application-payment/:application_id/:id')
  @ApiParam({
    name: 'application_id',
    type: String,
    required: true,
    description: 'The id of the application to update fulfilled status.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the payment.',
  })
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

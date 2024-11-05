import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'

import { PaymentFlowService } from './paymentFlow.service'
import { PaymentInformation } from '../../types'
import { CreatePaymentFlowDTO } from './dtos/createPaymentFlow.dto'
import { GetPaymentFlowDTO } from './dtos/getPaymentFlow.dto'

type CreatePaymentUrlResponse = { url: string }

@ApiTags('payments')
@Controller({
  path: 'payments',
  version: ['1'],
})
export class PaymentFlowController {
  constructor(private readonly paymentFlowService: PaymentFlowService) {}

  @Get(':id')
  @Documentation({
    description:
      'Creates a new PaymentFlow initialised with PaymentInformation.',
    response: { status: 200, type: GetPaymentFlowDTO },
  })
  getPaymentInfo(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GetPaymentFlowDTO | null> {
    return this.paymentFlowService.getPaymentInfo(id)
  }

  @Post()
  @Documentation({
    description:
      'Creates a new PaymentFlow initialised with PaymentInformation.',
    response: { status: 200, type: CreatePaymentFlowDTO },
  })
  createPaymentUrl(
    @Body() paymentInfo: PaymentInformation,
  ): Promise<CreatePaymentUrlResponse> {
    console.log('Create payment url')
    console.log(paymentInfo)
    return this.paymentFlowService.createPaymentUrl(paymentInfo)
  }
}

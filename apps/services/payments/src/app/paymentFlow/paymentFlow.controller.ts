import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseUUIDPipe,
  UseGuards,
  Delete,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'

import { PaymentFlowService } from './paymentFlow.service'
import { CreatePaymentFlowDTO } from './dtos/createPaymentFlow.dto'
import { GetPaymentFlowDTO } from './dtos/getPaymentFlow.dto'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'
import { GetPaymentFlowStatusDTO } from './dtos/getPaymentFlowStatus.dto'

@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.isIslandisPaymentEnabled)
@ApiTags('payments')
@Controller({
  path: 'payments',
  version: ['1'],
})
export class PaymentFlowController {
  constructor(private readonly paymentFlowService: PaymentFlowService) {}

  @Get(':id')
  @Documentation({
    description: 'Retrieves payment flow information by ID.',
    response: { status: 200, type: GetPaymentFlowDTO },
  })
  getPaymentFlow(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GetPaymentFlowDTO | null> {
    return this.paymentFlowService.getPaymentFlow(id)
  }

  @Get(':id/status')
  @Documentation({
    description: 'Retrieves payment flow information by ID.',
    response: { status: 200, type: GetPaymentFlowStatusDTO },
  })
  async getPaymentFlowStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GetPaymentFlowStatusDTO | null> {
    const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(id)
    const status = await this.paymentFlowService.getPaymentFlowStatus(
      paymentFlow,
    )

    return {
      id: paymentFlow.id,
      ...status,
    }
  }

  @Delete(':id')
  @Documentation({
    description: 'Deletes a PaymentFlow.',
    response: { status: 200, type: GetPaymentFlowDTO },
  })
  deletePaymentFlow(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GetPaymentFlowDTO | null> {
    return this.paymentFlowService.deletePaymentFlow(id)
  }

  @Post()
  @Documentation({
    description: 'Creates a new PaymentFlow.',
    response: { status: 200, type: CreatePaymentFlowDTO },
  })
  createPaymentUrl(
    @Body() paymentInfo: CreatePaymentFlowInput,
  ): Promise<CreatePaymentFlowDTO> {
    return this.paymentFlowService.createPaymentUrl(paymentInfo)
  }
}

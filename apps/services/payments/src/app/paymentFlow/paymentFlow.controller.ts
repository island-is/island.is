import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseUUIDPipe,
  UseGuards,
  Delete,
  Query,
  Headers,
  BadRequestException,
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
import { GetPaymentFlowsPaginatedDTO } from './dtos/getPaymentFlow.dto'
import { GetPaymentFlowsInput } from './dtos/getPaymentFlows.input'

@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.isIslandisPaymentEnabled)
@ApiTags('payments')
@Controller({
  path: 'payments',
  version: ['1'],
})
export class PaymentFlowController {
  constructor(private readonly paymentFlowService: PaymentFlowService) {}

  @Get('/')
  @Documentation({
    description:
      'Get payment flows and events by payer nationalId or paymentFlowId.',
    response: { status: 200, type: GetPaymentFlowsPaginatedDTO },
  })
  getPaymentFlows(
    @Query() input: GetPaymentFlowsInput,
    @Headers('X-Query-National-Id') payerNationalId: string,
  ): Promise<GetPaymentFlowsPaginatedDTO> {
    if (!payerNationalId && !input.search) {
      throw new BadRequestException(
        'Either payerNationalId or search must be provided',
      )
    }

    return this.paymentFlowService.searchPaymentFlows(
      payerNationalId,
      input.search,
      input.limit,
      input.after,
      input.before,
    ) as Promise<GetPaymentFlowsPaginatedDTO>
  }

  @Get(':id')
  @Documentation({
    description: 'Retrieves payment flow information by ID.',
    response: { status: 200, type: GetPaymentFlowDTO },
  })
  getPaymentFlow(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('includeEvents') includeEvents?: boolean,
  ): Promise<GetPaymentFlowDTO | null> {
    return this.paymentFlowService.getPaymentFlow(id, includeEvents)
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

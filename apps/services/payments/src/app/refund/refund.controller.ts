import { Body, Controller, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { RefundPaymentInput, RefundPaymentResponse } from './dtos'
import { RefundOrchestrationService } from './refundOrchestration.service'

@ApiTags('payments')
@Controller({
  path: 'payments/refund',
  version: ['1'],
})
export class RefundController {
  constructor(
    private readonly refundOrchestrationService: RefundOrchestrationService,
  ) {}

  @Post()
  @ApiOkResponse({
    type: RefundPaymentResponse,
  })
  async refund(
    @Body() refundPaymentInput: RefundPaymentInput,
  ): Promise<RefundPaymentResponse> {
    return this.refundOrchestrationService.refund(refundPaymentInput)
  }
}

import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { ScopesGuard } from '@island.is/auth-nest-tools'

import { GetPaymentFlowInput } from './dto/getPaymentFlow.input'
import { GetPaymentFlowResponse } from './dto/getPaymentFlow.response'
import { PaymentsService } from './payments.service'

@UseGuards(ScopesGuard)
@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query(() => GetPaymentFlowResponse)
  async getPaymentFlow(
    @Args('input', { type: () => GetPaymentFlowInput })
    input: GetPaymentFlowInput,
  ): Promise<GetPaymentFlowResponse> {
    return this.paymentsService.getPaymentFlow(input)
  }
}

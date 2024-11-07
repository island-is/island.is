import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { ScopesGuard } from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

import { GetPaymentFlowInput } from './dto/getPaymentFlow.input'
import { GetPaymentFlowResponse } from './dto/getPaymentFlow.response'
import { PaymentsService } from './payments.service'

@UseGuards(ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isIslandisPaymentEnabled)
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

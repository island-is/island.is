import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { Documentation } from '@island.is/nest/swagger'

import { CreateDebtPaymentFlowInput } from './dtos/createDebtPaymentFlow.input'
import { CreatePaymentFlowDTO } from './dtos/createPaymentFlow.dto'
import { PaymentFlowService } from './paymentFlow.service'

@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.isIslandisDebtPaymentEnabled)
@ApiTags('payments')
@Controller({
  path: 'payments/debts',
  version: ['1'],
})
export class DebtPaymentFlowController {
  constructor(private readonly paymentFlowService: PaymentFlowService) {}

  @Post()
  @Documentation({
    description:
      'Creates a new PaymentFlow for paying debts owed to the state. Fjársýslan validates the debts and decides which payment methods are available.',
    response: { status: 200, type: CreatePaymentFlowDTO },
  })
  createDebtPaymentUrl(
    @Body() input: CreateDebtPaymentFlowInput,
  ): Promise<CreatePaymentFlowDTO> {
    return this.paymentFlowService.createDebtPaymentUrl(input)
  }
}

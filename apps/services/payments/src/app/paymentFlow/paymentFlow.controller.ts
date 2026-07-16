import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  ParseUUIDPipe,
  UseGuards,
  Delete,
  Query,
  Headers,
  BadRequestException,
  forwardRef,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'

import { PaymentStatus } from '../../types'
import { BankTransferService } from '../bankTransferPayment/bankTransfer.service'
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
  constructor(
    private readonly paymentFlowService: PaymentFlowService,
    @Inject(forwardRef(() => BankTransferService))
    private readonly bankTransferService: BankTransferService,
  ) {}

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
  async getPaymentFlow(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('includeEvents') includeEvents?: boolean,
  ): Promise<GetPaymentFlowDTO | null> {
    const base = await this.paymentFlowService.getPaymentFlow(id, includeEvents)
    // Only UNPAID flows can have a bank-transfer overlay; PAID/INVOICE_PENDING short-circuit.
    if (!base || base.paymentStatus !== PaymentStatus.UNPAID) {
      return base
    }

    // getBankTransferStatus may finalize a just-settled transfer and report PAID, so we fold its
    // result in rather than trusting the pre-overlay `base` snapshot.
    const overlay = await this.bankTransferService.getBankTransferStatus(id)
    if (!overlay) {
      return base
    }

    return {
      ...base,
      paymentStatus: overlay.paymentStatus,
      updatedAt: overlay.updatedAt,
      bankTransferScaRedirectUrl: overlay.bankTransferScaRedirectUrl,
      lastBankTransferFailure: overlay.lastBankTransferFailure,
      bankTransferExpiresAt: overlay.bankTransferExpiresAt,
      bankTransferPendingStatus: overlay.bankTransferPendingStatus,
    }
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

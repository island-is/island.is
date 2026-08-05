import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

import { BankTransferService } from './bankTransfer.service'
import { CreateBankTransferInput } from './dtos/createBankTransfer.input'
import { CreateBankTransferResponse } from './dtos/createBankTransfer.response'
import {
  VerifyBankTransferInput,
  isVerifyBankTransferInputWellFormed,
} from './dtos/verifyBankTransfer.input'
import { VerifyBankTransferResponse } from './dtos/verifyBankTransfer.response'
import { CancelBankTransferInput } from './dtos/cancelBankTransfer.input'
import { CancelBankTransferResponse } from './dtos/cancelBankTransfer.response'

@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.isIslandisBankTransferPaymentEnabled)
@ApiTags('payments')
@Controller({
  path: 'payments/bank-transfer',
  version: ['1'],
})
export class BankTransferController {
  constructor(private readonly bankTransferService: BankTransferService) {}

  /**
   * Initiates a new bank-transfer attempt — generates the per-attempt `correlationId`, calls the
   * provider, persists the row, and emits `payment_started`. The frontend redirects the user to
   * `scaRedirectUrl` if non-empty (otherwise the bank uses back-channel SCA).
   */
  @Post('/create')
  @ApiOkResponse({ type: CreateBankTransferResponse })
  async create(
    @Body() input: CreateBankTransferInput,
  ): Promise<CreateBankTransferResponse> {
    return this.bankTransferService.create(input)
  }

  /**
   * Frontend polling target while the user is at the provider's SCA / waiting screen, and the path the
   * FE's Next.js webhook handler (`apps/payments/pages/api/bank-transfer/callback.ts`) proxies through
   * the GraphQL layer to. Idempotent — see {@link BankTransferService.verify}.
   */
  @Post('/verify')
  @ApiOkResponse({ type: VerifyBankTransferResponse })
  async verify(
    @Body() input: VerifyBankTransferInput,
  ): Promise<VerifyBankTransferResponse> {
    if (!isVerifyBankTransferInputWellFormed(input)) {
      throw new BadRequestException(
        'Provide exactly one of paymentFlowId or providerPaymentId',
      )
    }
    return this.bankTransferService.verify(input)
  }

  /**
   * Cancels the active bank-transfer attempt for a flow. Driven by the FE's "Cancel" button on the
   * pending screen and "Start Again" button on the failed screen. For a still-PENDING + fresh row it
   * asks Blikk to cancel first; Blikk only cancels DRAFT payments, so a live (already-initiated)
   * payment makes this throw and the local row is left active rather than orphaned. Idempotent.
   */
  @Post('/cancel')
  @ApiOkResponse({ type: CancelBankTransferResponse })
  async cancel(
    @Body() input: CancelBankTransferInput,
  ): Promise<CancelBankTransferResponse> {
    return this.bankTransferService.cancel(input)
  }
}

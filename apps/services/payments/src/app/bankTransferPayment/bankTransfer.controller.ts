import { Body, Controller, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { BankTransferService } from './bankTransfer.service'
import { CreateBankTransferInput } from './dtos/createBankTransfer.input'
import { CreateBankTransferResponse } from './dtos/createBankTransfer.response'
import { VerifyBankTransferInput } from './dtos/verifyBankTransfer.input'
import { VerifyBankTransferResponse } from './dtos/verifyBankTransfer.response'
import { CancelBankTransferInput } from './dtos/cancelBankTransfer.input'
import { CancelBankTransferResponse } from './dtos/cancelBankTransfer.response'

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
    return this.bankTransferService.verify(input)
  }

  /**
   * Cancels the active bank-transfer attempt for a flow. Driven by the FE's "Cancel" button on the
   * pending screen and "Start Again" button on the failed screen. Best-effort calls Blikk's cancel
   * endpoint when the row is still PENDING + fresh; always soft-deletes the local row. Idempotent.
   */
  @Post('/cancel')
  @ApiOkResponse({ type: CancelBankTransferResponse })
  async cancel(
    @Body() input: CancelBankTransferInput,
  ): Promise<CancelBankTransferResponse> {
    return this.bankTransferService.cancel(input)
  }
}

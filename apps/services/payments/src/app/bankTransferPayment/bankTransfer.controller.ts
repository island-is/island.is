import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BankTransferService } from './bankTransfer.service'
import { BankTransferCallbackInput } from './dtos/bankTransferCallback.input'
import { CreateBankTransferInput } from './dtos/createBankTransfer.input'
import { CreateBankTransferResponse } from './dtos/createBankTransfer.response'
import { VerifyBankTransferInput } from './dtos/verifyBankTransfer.input'
import { VerifyBankTransferResponse } from './dtos/verifyBankTransfer.response'

@ApiTags('payments')
@Controller({
  path: 'payments/bank-transfer',
  version: ['1'],
})
export class BankTransferController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly bankTransferService: BankTransferService,
  ) {}

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
   * provider callback delegates to. Idempotent — see {@link BankTransferService.verify}.
   */
  @Post('/verify')
  @ApiOkResponse({ type: VerifyBankTransferResponse })
  async verify(
    @Body() input: VerifyBankTransferInput,
  ): Promise<VerifyBankTransferResponse> {
    return this.bankTransferService.verify(input)
  }

  /**
   * Provider webhook. Always returns 200 — the provider retries on non-2xx, and we don't want them to:
   * settlement is idempotent and a missed callback is recovered by the frontend's polling. Authenticity
   * of the callback is not currently verified (TODO: HMAC/signature check once we know what Blikk uses).
   */
  @Post('/callback')
  @HttpCode(200)
  async callback(
    @Body() input: BankTransferCallbackInput,
  ): Promise<{ received: true }> {
    try {
      await this.bankTransferService.verify({ providerPaymentId: input.id })
    } catch (error) {
      this.logger.error(
        `Bank transfer callback failed to verify (providerPaymentId: ${input.id})`,
        { error: (error as Error)?.message },
      )
    }
    return { received: true }
  }
}

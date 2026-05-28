import { Body, Controller, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { BankTransferService } from './bankTransfer.service'
import { VerifyBankTransferInput } from './dtos/verifyBankTransfer.input'
import { VerifyBankTransferResponse } from './dtos/verifyBankTransfer.response'

@ApiTags('payments')
@Controller({
  path: 'payments/bank-transfer',
  version: ['1'],
})
export class BankTransferController {
  constructor(private readonly bankTransferService: BankTransferService) {}

  /**
   * Frontend polling target while the user is at the provider's SCA / waiting screen, and the path the
   * provider callback (added in TODO 7) delegates to. Idempotent — see
   * {@link BankTransferService.verify}.
   */
  @Post('/verify')
  @ApiOkResponse({ type: VerifyBankTransferResponse })
  async verify(
    @Body() input: VerifyBankTransferInput,
  ): Promise<VerifyBankTransferResponse> {
    return this.bankTransferService.verify(input)
  }
}

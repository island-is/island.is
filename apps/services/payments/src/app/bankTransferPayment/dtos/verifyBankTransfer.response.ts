import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

import { BankTransferStatus } from '../bankTransfer.types'

/**
 * Status snapshot returned to the caller of `POST /payments/bank-transfer/verify`. On SUCCESS, settlement
 * has already been triggered server-side (see `BankTransferService.confirmBankTransferPayment`); on
 * terminal failure the underlying `bank_transfer_payment` row has been soft-deleted so a retry can begin a
 * fresh attempt.
 */
export class VerifyBankTransferResponse {
  @IsEnum(BankTransferStatus)
  @ApiProperty({ enum: BankTransferStatus })
  readonly status!: BankTransferStatus

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly message?: string
}

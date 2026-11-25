import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

import {
  BankTransferFailureReason,
  BankTransferStatus,
  BankTransferPendingStatus,
} from '../bankTransfer.types'

/**
 * Status snapshot from verify. Server-side settlement is already triggered on SUCCESS, and a debt
 * flow only reports SUCCESS once FJS answered or the worker took over.
 */
export class VerifyBankTransferResponse {
  @IsEnum(BankTransferStatus)
  @ApiProperty({ enum: BankTransferStatus })
  readonly status!: BankTransferStatus

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly message?: string

  // Pending sub-status; Controls if the UI should show the SCA (QR/deep link) or waiting UI.
  @IsOptional()
  @IsEnum(BankTransferPendingStatus)
  @ApiPropertyOptional({ enum: BankTransferPendingStatus })
  readonly pendingStatus?: BankTransferPendingStatus

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly scaRedirectUrl?: string

  @IsOptional()
  @IsEnum(BankTransferFailureReason)
  @ApiPropertyOptional({ enum: BankTransferFailureReason })
  readonly failureReason?: BankTransferFailureReason

  // A debt flow FJS rejected: the transfer settled, but the payment is refunded instead.
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly isClosed?: boolean
}

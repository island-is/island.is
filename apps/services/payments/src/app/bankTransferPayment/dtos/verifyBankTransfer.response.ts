import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

import { BankTransferStatus } from '../bankTransfer.types'

/** Status snapshot from verify. Server-side settlement is already triggered on SUCCESS. */
export class VerifyBankTransferResponse {
  @IsEnum(BankTransferStatus)
  @ApiProperty({ enum: BankTransferStatus })
  readonly status!: BankTransferStatus

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly message?: string
}

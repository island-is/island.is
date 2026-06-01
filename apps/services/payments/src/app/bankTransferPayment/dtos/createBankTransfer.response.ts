import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsOptional, IsString } from 'class-validator'

export class CreateBankTransferResponse {
  @IsString()
  @ApiProperty()
  readonly providerPaymentId!: string

  // Empty / undefined = back-channel SCA, no redirect.
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly scaRedirectUrl?: string

  @IsDate()
  @ApiProperty()
  readonly expiresAt!: Date
}

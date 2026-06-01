import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

/** Provide exactly one of paymentFlowId or providerPaymentId. */
export class VerifyBankTransferInput {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly paymentFlowId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly providerPaymentId?: string
}

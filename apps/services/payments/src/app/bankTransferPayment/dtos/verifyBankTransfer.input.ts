import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

/**
 * Resolves the active bank-transfer attempt by EITHER the payment-flow id (used by the frontend's
 * polling target) OR the provider's payment id (used by the provider callback's translation step).
 * Exactly one must be provided; the handler enforces this and rejects otherwise.
 */
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

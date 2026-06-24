import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

/**
 * Provide exactly one of paymentFlowId or providerPaymentId. The "exactly one"
 * cross-field constraint is enforced at the controller layer (class-validator's
 * `@IsOptional` short-circuits property-level constraints when the value is
 * undefined, so the check can't live cleanly on a single field).
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

/** True iff exactly one of the lookup keys is provided. Use at the controller boundary. */
export const isVerifyBankTransferInputWellFormed = (
  input: VerifyBankTransferInput,
): boolean => Boolean(input.paymentFlowId) !== Boolean(input.providerPaymentId)

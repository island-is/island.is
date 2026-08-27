import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

/** Cancels the active bank-transfer attempt for a flow. Idempotent. */
export class CancelBankTransferInput {
  @IsUUID()
  @ApiProperty()
  readonly paymentFlowId!: string
}

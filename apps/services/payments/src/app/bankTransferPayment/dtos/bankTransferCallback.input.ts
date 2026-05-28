import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

/**
 * Blikk webhook payload. Only `id` (the `providerPaymentId`) is required by us — the rest are accepted
 * and forwarded into logs but ignored for branching; the authoritative state is fetched via
 * `getPayment` inside `verify`.
 */
export class BankTransferCallbackInput {
  @IsString()
  @ApiProperty()
  readonly id!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly status?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly sourceReferenceId?: string
}

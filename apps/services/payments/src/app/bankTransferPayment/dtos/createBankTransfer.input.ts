import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsUUID } from 'class-validator'

/** Locale for the partner-redirect URL sent to Blikk. */
export enum BankTransferLocale {
  IS = 'is',
  EN = 'en',
}

export class CreateBankTransferInput {
  @IsUUID()
  @ApiProperty()
  readonly paymentFlowId!: string

  @IsEnum(BankTransferLocale)
  @ApiProperty({ enum: BankTransferLocale })
  readonly locale!: BankTransferLocale
}

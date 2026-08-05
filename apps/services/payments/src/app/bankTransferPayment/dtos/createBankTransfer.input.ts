import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsUUID, IsString, Matches } from 'class-validator'

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

  // Payer's bank account number, 12 digits.
  @IsString()
  @Matches(/^\d{12}$/)
  @ApiProperty()
  readonly bankAccountNumber!: string
}

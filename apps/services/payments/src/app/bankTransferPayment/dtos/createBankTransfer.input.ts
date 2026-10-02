import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsUUID, IsString, Matches } from 'class-validator'

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

  // National id of the individual authorising the transfer for a company payer, 10 digits.
  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/)
  @ApiPropertyOptional({
    description:
      'National id of the individual with the rights to authorise payments from the company account. Required when the payer is a company; ignored otherwise.',
  })
  readonly actorNationalId?: string
}

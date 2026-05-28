import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsUUID } from 'class-validator'

/**
 * Locales the consuming frontend can land the user back on after SCA. Used to construct the
 * `partnerRedirectUrl` we send to Blikk.
 */
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

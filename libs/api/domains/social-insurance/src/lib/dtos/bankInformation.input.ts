import { Field, InputType } from '@nestjs/graphql'

@InputType('SocialInsuranceBankInformationInput')
export class BankInformationInput {
  @Field({ nullable: true })
  bank?: string

  @Field({ nullable: true })
  ledger?: string

  @Field({ nullable: true })
  accountNumber?: string

  @Field({ nullable: true })
  iban?: string

  @Field({ nullable: true })
  swift?: string

  @Field({ nullable: true })
  foreignBankName?: string

  @Field({ nullable: true })
  foreignBankAddress?: string

  @Field({ nullable: true })
  foreignCurrency?: string
}

import { Field, InterfaceType } from '@nestjs/graphql'

@InterfaceType('SocialInsuranceBankInformationBase')
export abstract class BankInformationBase {
  @Field()
  bank!: string

  @Field()
  ledger!: string

  @Field(() => [String])
  currencies!: string[]
}

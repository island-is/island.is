import { Field, ObjectType } from '@nestjs/graphql'
import { BankInformationBase } from './bankInformationBase.model'

@ObjectType('SocialInsuranceForeignBankInformation', {
  implements: () => [BankInformationBase],
})
export class ForeignBankInformation extends BankInformationBase {
  @Field()
  iban!: string

  @Field()
  swift!: string

  @Field()
  foreignBankName!: string

  @Field()
  foreignBankAddress!: string

  @Field()
  foreignCurrency!: string
}

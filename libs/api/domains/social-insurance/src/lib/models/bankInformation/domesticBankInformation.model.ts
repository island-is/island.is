import { Field, ObjectType } from '@nestjs/graphql'
import { BankInformationBase } from './bankInformationBase.model'

@ObjectType('SocialInsuranceDomesticBankInformation', {
  implements: () => [BankInformationBase],
})
export class DomesticBankInformation extends BankInformationBase {
  @Field()
  accountNumber!: string
}

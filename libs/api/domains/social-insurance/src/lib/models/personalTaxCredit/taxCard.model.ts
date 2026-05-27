import { Field, ObjectType } from '@nestjs/graphql'
import { TaxCardSummary } from './taxCardSummary.model'
import { YearWithMonths } from './taxCardMonthsAndYears.model'

@ObjectType('SocialInsurancePersonalTaxCredit')
export class PersonalTaxCredit {
  @Field(() => [TaxCardSummary], { nullable: true })
  taxCards?: TaxCardSummary[]

  @Field()
  canEdit!: boolean

  @Field()
  canDiscontinue!: boolean

  @Field(() => [YearWithMonths], { nullable: true })
  registrationMonthsAndYears?: YearWithMonths[]

  @Field(() => [YearWithMonths], { nullable: true })
  discontinuingMonthsAndYears?: YearWithMonths[]
}

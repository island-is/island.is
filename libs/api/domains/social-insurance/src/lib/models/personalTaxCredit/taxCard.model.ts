import { Field, ObjectType } from '@nestjs/graphql'
import { YearWithMonths } from './taxCardMonthsAndYears.model'

@ObjectType('SocialInsuranceTaxCardSummary')
export class TaxCardSummary {
  @Field(() => Number)
  percentage!: number

  @Field({ nullable: true })
  validFrom?: Date

  @Field(() => Date, { nullable: true })
  validTo?: Date

  @Field()
  taxCardType!: string
}

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

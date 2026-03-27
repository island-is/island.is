import { Field, ObjectType } from '@nestjs/graphql'
import { YearWithMonths } from './taxCardMonthsAndYears.model'
import { SpousalTaxCardEligibility } from './spousalTaxCardEligibility.model'

@ObjectType('SocialInsuranceTaxCardSummary')
export class TaxCardSummary {
  @Field(() => Number, { nullable: true })
  percentage?: number

  @Field({ nullable: true })
  validFrom?: Date

  @Field(() => Date, { nullable: true })
  validTo?: Date

  @Field(() => String, { nullable: true })
  taxCardType?: string
}

@ObjectType('SocialInsurancePersonalTaxCredit')
export class PersonalTaxCredit {
  @Field(() => [TaxCardSummary], { nullable: true })
  taxCards?: TaxCardSummary[]

  @Field(() => Boolean, { nullable: true })
  canEdit?: boolean

  @Field(() => Boolean, { nullable: true })
  canDiscontinue?: boolean

  @Field(() => [YearWithMonths], { nullable: true })
  registrationMonthsAndYears?: YearWithMonths[]

  @Field(() => [YearWithMonths], { nullable: true })
  discontinuingMonthsAndYears?: YearWithMonths[]

  @Field(() => SpousalTaxCardEligibility, { nullable: true })
  spouseEligibility?: SpousalTaxCardEligibility
}

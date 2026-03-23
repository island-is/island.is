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
  validTo?: Date | null

  @Field(() => String, { nullable: true })
  taxCardType?: string | null
}

@ObjectType('SocialInsurancePersonalTaxCredit')
export class PersonalTaxCredit {
  @Field(() => [TaxCardSummary], { nullable: true })
  taxCards?: TaxCardSummary[] | null

  @Field(() => Boolean, { nullable: true })
  canEdit?: boolean

  @Field(() => Boolean, { nullable: true })
  canDiscontinue?: boolean

  @Field(() => [YearWithMonths], { nullable: true })
  registrationMonthsAndYears?: YearWithMonths[] | null

  @Field(() => [YearWithMonths], { nullable: true })
  discontinuingMonthsAndYears?: YearWithMonths[] | null

  @Field(() => SpousalTaxCardEligibility, { nullable: true })
  spouseEligibility?: SpousalTaxCardEligibility | null
}

import { Field, Int, ObjectType } from '@nestjs/graphql'
import { YearWithMonths } from './taxCardMonthsAndYears.model'

@ObjectType('SocialInsuranceSpousalTaxCardEligibility')
export class SpousalTaxCardEligibility {
  @Field(() => Boolean, { nullable: true })
  canApply?: boolean

  @Field(() => String, { nullable: true })
  reasonNotAllowed?: string | null

  @Field(() => [YearWithMonths], { nullable: true })
  allowedYearMonths?: YearWithMonths[] | null
}

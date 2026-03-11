import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMonthOption')
export class MonthOption {
  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => Boolean, { nullable: true })
  selectable?: boolean
}

@ObjectType('SocialInsuranceYearWithMonths')
export class YearWithMonths {
  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => [MonthOption], { nullable: true })
  months?: MonthOption[] | null
}

@ObjectType('SocialInsuranceTaxCardMonthsAndYears')
export class TaxCardMonthsAndYears {
  @Field(() => [String], { nullable: true })
  months?: string[] | null

  @Field(() => [Int], { nullable: true })
  years?: number[] | null
}

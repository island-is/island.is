import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { YearWithMonths } from './taxCardMonthsAndYears.model'

@ObjectType('SocialInsuranceTaxCardSummary')
export class TaxCardSummary {
  @Field(() => Int)
  percentage!: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  validFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  validTo?: Date

  @Field({ nullable: true })
  type?: string
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

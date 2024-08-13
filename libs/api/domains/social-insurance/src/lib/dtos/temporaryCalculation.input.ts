import { InputType, Field, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceIncomeType')
class IncomeType {
  @Field(() => Int, { nullable: true })
  incomeTypeNumber?: number

  @Field()
  incomeTypeCode?: string

  @Field()
  incomeTypeName?: string

  @Field()
  currencyCode?: string

  @Field(() => Int, { nullable: true })
  incomeCategoryNumber?: number

  @Field()
  incomeCategoryCode?: string

  @Field()
  incomeCategoryName?: string

  @Field(() => Number, { nullable: true })
  amountJan?: number

  @Field(() => Number, { nullable: true })
  amountFeb?: number

  @Field(() => Number, { nullable: true })
  amountMar?: number

  @Field(() => Number, { nullable: true })
  amountApr?: number

  @Field(() => Number, { nullable: true })
  amountMay?: number

  @Field(() => Number, { nullable: true })
  amountJun?: number

  @Field(() => Number, { nullable: true })
  amountJul?: number

  @Field(() => Number, { nullable: true })
  amountAug?: number

  @Field(() => Number, { nullable: true })
  amountSep?: number

  @Field(() => Number, { nullable: true })
  amountOct?: number

  @Field(() => Number, { nullable: true })
  amountNov?: number

  @Field(() => Number, { nullable: true })
  amountDec?: number
}

@InputType('SocialInsuranceTemporaryCalculationInput')
export class TemporaryCalculationInput {
  @Field(() => Int)
  incomeYear!: number

  @Field(() => [IncomeType], { nullable: true })
  incomeTypes?: Array<IncomeType>
}

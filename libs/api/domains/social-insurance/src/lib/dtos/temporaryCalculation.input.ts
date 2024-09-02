import { InputType, Field, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceIncomeType')
class IncomeType {
  @Field(() => Int, { nullable: true })
  incomeTypeNumber?: number

  @Field(() => String, { nullable: true })
  incomeTypeCode?: string

  @Field(() => String, { nullable: true })
  incomeTypeName?: string

  @Field(() => String, { nullable: true })
  currencyCode?: string

  @Field(() => Int, { nullable: true })
  incomeCategoryNumber?: number

  @Field(() => String, { nullable: true })
  incomeCategoryCode?: string

  @Field(() => String, { nullable: true })
  incomeCategoryName?: string

  @Field(() => Int, { nullable: true })
  amountJan?: number

  @Field(() => Int, { nullable: true })
  amountFeb?: number

  @Field(() => Int, { nullable: true })
  amountMar?: number

  @Field(() => Int, { nullable: true })
  amountApr?: number

  @Field(() => Int, { nullable: true })
  amountMay?: number

  @Field(() => Int, { nullable: true })
  amountJun?: number

  @Field(() => Int, { nullable: true })
  amountJul?: number

  @Field(() => Int, { nullable: true })
  amountAug?: number

  @Field(() => Int, { nullable: true })
  amountSep?: number

  @Field(() => Int, { nullable: true })
  amountOct?: number

  @Field(() => Int, { nullable: true })
  amountNov?: number

  @Field(() => Int, { nullable: true })
  amountDec?: number
}

@InputType('SocialInsuranceTemporaryCalculationInput')
export class TemporaryCalculationInput {
  @Field(() => Int)
  incomeYear!: number

  @Field(() => [IncomeType], { nullable: true })
  incomeTypes?: Array<IncomeType>
}

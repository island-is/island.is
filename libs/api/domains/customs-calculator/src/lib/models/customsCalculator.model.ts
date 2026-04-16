import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsCalculatorStatus {
  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  message?: string
}

@ObjectType()
export class CustomsCalculatorProductCategory {
  @Field({ nullable: true })
  parentCategory?: string

  @Field({ nullable: true })
  category?: string

  @Field({ nullable: true })
  tariffNumber?: string

  @Field({ nullable: true })
  description?: string
}

@ObjectType()
export class CustomsCalculatorProductCategoriesResponse {
  @Field(() => CustomsCalculatorStatus, { nullable: true })
  status?: CustomsCalculatorStatus

  @Field(() => [CustomsCalculatorProductCategory], { nullable: true })
  categories?: CustomsCalculatorProductCategory[]

  @Field({ nullable: true })
  errors?: string
}

@ObjectType()
export class CustomsCalculatorUnitsResponse {
  @Field(() => CustomsCalculatorStatus, { nullable: true })
  status?: CustomsCalculatorStatus

  @Field(() => [String], { nullable: true })
  units?: string[]

  @Field({ nullable: true })
  errors?: string
}

@ObjectType()
export class CustomsCalculatorCharge {
  @Field({ nullable: true })
  chargeType?: string

  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  amount?: string

  @Field({ nullable: true })
  netAmount?: string

  @Field({ nullable: true })
  ratePercent?: string

  @Field({ nullable: true })
  rateAmount?: string
}

@ObjectType()
export class CustomsCalculatorLineCharge {
  @Field({ nullable: true })
  reportId?: string

  @Field({ nullable: true })
  currencyName?: string

  @Field(() => [CustomsCalculatorCharge], { nullable: true })
  charges?: CustomsCalculatorCharge[]
}

@ObjectType()
export class CustomsCalculatorCalculationResponse {
  @Field(() => CustomsCalculatorStatus, { nullable: true })
  status?: CustomsCalculatorStatus

  @Field(() => CustomsCalculatorLineCharge, { nullable: true })
  lineCharge?: CustomsCalculatorLineCharge

  @Field({ nullable: true })
  exchangeRate?: string

  @Field({ nullable: true })
  errors?: string
}


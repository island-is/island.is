import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceTemporaryCalculationRow')
class TemporaryCalculationRow {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => Int, { nullable: true })
  total?: number

  @Field(() => [TemporaryCalculationMonth], { nullable: true })
  months?: Array<TemporaryCalculationMonth>
}

@ObjectType('SocialInsuranceTemporaryCalculationMonth')
class TemporaryCalculationMonth {
  @Field(() => Int)
  month!: number

  @Field(() => Int, { nullable: true })
  amount?: number
}

@ObjectType('SocialInsuranceTemporaryCalculationGroup')
class TemporaryCalculationGroup {
  @Field(() => String, { nullable: true })
  group?: string

  @Field(() => Int, { nullable: true })
  groupId?: number

  @Field(() => Int, { nullable: true })
  total?: number

  @Field(() => [TemporaryCalculationMonth], { nullable: true })
  monthTotals?: Array<TemporaryCalculationMonth>

  @Field(() => [TemporaryCalculationRow], { nullable: true })
  rows?: Array<TemporaryCalculationRow>
}

@ObjectType('SocialInsuranceTemporaryCalculation')
export class TemporaryCalculation {
  @Field(() => Int, { nullable: true })
  totalPayment?: number

  @Field(() => Int, { nullable: true })
  subtracted?: number

  @Field(() => Int, { nullable: true })
  paidOut?: number

  @Field(() => [TemporaryCalculationGroup], { nullable: true })
  groups?: Array<TemporaryCalculationGroup>
}

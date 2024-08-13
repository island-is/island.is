import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceTemporaryCalculationRow')
class TemporaryCalculationRow {
  @Field()
  name?: string

  @Field(() => Number, { nullable: true })
  total?: number

  @Field(() => [TemporaryCalculationMonth], { nullable: true })
  months?: Array<TemporaryCalculationMonth>
}

@ObjectType('SocialInsuranceTemporaryCalculationMonth')
class TemporaryCalculationMonth {
  @Field(() => Int)
  month!: number

  @Field(() => Number, { nullable: true })
  amount?: number
}

@ObjectType('SocialInsuranceTemporaryCalculationGroup')
class TemporaryCalculationGroup {
  @Field()
  group?: string

  @Field(() => Number, { nullable: true })
  groupId?: number

  @Field(() => Number, { nullable: true })
  total?: number

  @Field(() => [TemporaryCalculationMonth], { nullable: true })
  monthTotals?: Array<TemporaryCalculationMonth>

  @Field(() => [TemporaryCalculationRow], { nullable: true })
  rows?: Array<TemporaryCalculationRow>
}

@ObjectType('SocialInsuranceTemporaryCalculation')
export class TemporaryCalculation {
  @Field(() => Number, { nullable: true })
  totalPayment?: number

  @Field(() => Number, { nullable: true })
  subtracted?: number

  @Field(() => Number, { nullable: true })
  paidOut?: number

  @Field(() => [TemporaryCalculationGroup], { nullable: true })
  groups?: Array<TemporaryCalculationGroup>
}

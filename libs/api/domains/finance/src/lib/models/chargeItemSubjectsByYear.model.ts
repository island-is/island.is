import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceChargeItemSubjectsByYearPeriodData')
export class ChargeItemSubjectsByYearPeriodData {
  @Field()
  period!: string

  @Field()
  description!: string

  @Field()
  lastMoveDate!: string

  @Field()
  amount!: string
}

@ObjectType('FinanceChargeItemSubjectsByYearData')
export class ChargeItemSubjectsByYearData {
  @Field()
  chargeItemSubject!: string

  @Field()
  lastMoveDate!: string

  @Field()
  totalAmount!: number

  @Field(() => [ChargeItemSubjectsByYearPeriodData])
  periods!: ChargeItemSubjectsByYearPeriodData[]
}

@ObjectType('FinanceChargeItemSubjectsByYear')
export class ChargeItemSubjectsByYear {
  @Field(() => [ChargeItemSubjectsByYearData])
  chargeItemSubjects!: ChargeItemSubjectsByYearData[]

  @Field(() => Boolean, { nullable: true })
  more?: boolean

  @Field({ nullable: true })
  nextKey?: string
}

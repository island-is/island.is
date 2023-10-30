import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
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

@ObjectType()
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

@ObjectType()
export class ChargeItemSubjectsByYearModel {
  @Field(() => [ChargeItemSubjectsByYearData])
  chargeItemSubjects!: ChargeItemSubjectsByYearData[]

  @Field(() => Boolean)
  more!: boolean

  @Field({ nullable: true })
  nextKey?: string
}

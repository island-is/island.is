import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceChargeTypeDetailsData')
export class FinanceChargeTypeDetailsData {
  @Field()
  ID!: string

  @Field()
  name!: string

  @Field()
  chargeItemSubjects!: string

  @Field()
  chargeItemSubjectDescription!: string

  @Field()
  lastMovementDate!: string
}

@ObjectType('FinanceChargeTypeDetailsModel')
export class FinanceChargeTypeDetailsModel {
  @Field(() => [FinanceChargeTypeDetailsData])
  chargeType!: FinanceChargeTypeDetailsData[]
}

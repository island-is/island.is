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

@ObjectType('FinanceChargeTypeDetails')
export class FinanceChargeTypeDetails {
  @Field(() => [FinanceChargeTypeDetailsData])
  chargeType!: FinanceChargeTypeDetailsData[]
}

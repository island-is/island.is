import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceChargeTypesByYearData')
export class ChargeTypesByYearData {
  @Field()
  ID!: string

  @Field()
  name!: string
}

@ObjectType('FinanceChargeTypesByYearModel')
export class ChargeTypesByYearModel {
  @Field(() => [ChargeTypesByYearData], { nullable: true })
  chargeType?: ChargeTypesByYearData[]
}

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceChargeTypesByYearData')
export class ChargeTypesByYearData {
  @Field()
  iD!: string

  @Field()
  name!: string
}

@ObjectType('FinanceChargeTypesByYear')
export class ChargeTypesByYear {
  @Field(() => [ChargeTypesByYearData], { nullable: true })
  chargeType?: ChargeTypesByYearData[]
}

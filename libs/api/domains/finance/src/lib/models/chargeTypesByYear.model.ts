import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ChargeTypesByYearData {
  @Field()
  ID!: string

  @Field()
  name!: string
}

@ObjectType()
export class ChargeTypesByYearModel {
  @Field(() => [ChargeTypesByYearData], { nullable: true })
  chargeType?: ChargeTypesByYearData[]
}

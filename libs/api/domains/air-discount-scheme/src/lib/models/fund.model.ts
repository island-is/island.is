import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AirDiscountSchemeFund')
export class Fund {
  @Field()
  credit!: number

  @Field()
  used!: number

  @Field()
  total!: number
}

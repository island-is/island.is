import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class FlightLegFund {
  @Field((_) => ID)
  nationalId: string

  @Field()
  unused: number

  @Field()
  total: number
}

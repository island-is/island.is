import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FlightLegsLeft {
  @Field()
  unused: number

  @Field()
  total: number
}

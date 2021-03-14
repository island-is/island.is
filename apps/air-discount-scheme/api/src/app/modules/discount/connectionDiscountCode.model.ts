import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ConnectionDiscountCode {
  @Field()
  code: string

  @Field()
  flightId: string

  @Field()
  flightDesc: string

  @Field()
  validUntil: string
}

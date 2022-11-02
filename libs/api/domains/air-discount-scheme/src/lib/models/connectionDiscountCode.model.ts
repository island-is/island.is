import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ConnectionDiscountCode {
  @Field((_1) => ID)
  code!: string

  @Field()
  flightId!: string

  @Field()
  flightDesc!: string

  @Field()
  validUntil!: string
}

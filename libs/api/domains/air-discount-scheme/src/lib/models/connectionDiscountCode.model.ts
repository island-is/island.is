import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AirDiscountSchemeConnectionDiscountCode')
export class ConnectionDiscountCode {
  @Field((_) => ID)
  code!: string

  @Field()
  flightId!: string

  @Field()
  flightDesc!: string

  @Field()
  validUntil!: string
}

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AirDiscountSchemeUsedFlightLeg')
export class UsedFlightLeg {
  @Field({ description: 'Origin - destination' })
  travel!: string

  @Field()
  bookingDate!: Date
}

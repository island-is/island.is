import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AirDiscountSchemeUsedFlightLeg')
export class UsedFlightLeg {
  @Field({ description: 'Origin and destination, e.g. REK - AEY' })
  travel!: string

  @Field({ description: 'When the booking was made, not the travel date' })
  bookingDate!: Date
}

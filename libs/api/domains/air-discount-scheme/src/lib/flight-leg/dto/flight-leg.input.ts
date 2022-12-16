import { Field, InputType } from '@nestjs/graphql'

@InputType('AirDiscountSchemeFlightLegsInput')
export class FlightLegsInput {
  @Field((_) => String)
  nationalId!: string
}

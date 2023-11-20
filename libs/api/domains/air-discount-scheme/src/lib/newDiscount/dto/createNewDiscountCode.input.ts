import { Field, InputType } from '@nestjs/graphql'

@InputType('AirDiscountSchemeCreateNewDiscountCodeInput')
export class CreateNewDiscountCodeInput {
  @Field((_) => String)
  origin!: string

  @Field((_) => String)
  destination!: string

  @Field((_) => Boolean)
  isRoundTrip!: boolean
}

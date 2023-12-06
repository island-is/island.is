import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('AirDiscountSchemeCreateExplicitDiscountCodeInput')
export class CreateExplicitDiscountCodeInput {
  @Field((_) => String)
  nationalId!: string

  @Field((_) => Int)
  postalcode!: number

  @Field((_) => String)
  comment!: string

  @Field((_) => Int)
  numberOfDaysUntilExpiration!: number

  @Field((_) => Boolean)
  isExplicit!: number

  @Field((_) => Int)
  flightLegs!: number
}

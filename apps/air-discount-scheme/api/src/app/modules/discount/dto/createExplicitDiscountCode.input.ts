import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateExplicitDiscountCodeInput {
  @Field((_) => String)
  nationalId: string

  @Field((_) => Int)
  postalcode: number

  @Field((_) => String)
  comment: string
}

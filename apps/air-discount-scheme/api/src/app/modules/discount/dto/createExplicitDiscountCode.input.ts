import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateExplicitDiscountCodeInput {
  @Field((_) => String)
  nationalId: string

  @Field((_) => String)
  firstName: string

  @Field((_) => String, { nullable: true })
  middleName: string

  @Field((_) => String)
  lastName: string

  @Field((_) => String)
  gender: 'kk' | 'kvk' | 'hvk'

  @Field((_) => String)
  address: string

  @Field((_) => Int)
  postalcode: number

  @Field((_) => String)
  city: string

  @Field((_) => String)
  comment: string
}

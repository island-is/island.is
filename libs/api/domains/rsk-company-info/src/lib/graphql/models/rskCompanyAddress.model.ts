import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RskCompanyAddress {
  @Field(() => String)
  address!: string

  @Field(() => String)
  address2!: string

  @Field(() => String)
  postNumber!: string

  @Field(() => String)
  municipality!: string

  @Field(() => String)
  municipalityNumber!: string

  @Field(() => String)
  country!: string
}

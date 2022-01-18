import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RskCompanyAddress {
  @Field(() => String, { nullable: true })
  streetAddress?: string

  @Field(() => String, { nullable: true })
  streetAddress2?: string

  @Field(() => String, { nullable: true })
  postalCode?: string

  @Field(() => String, { nullable: true })
  city?: string

  @Field(() => String, { nullable: true })
  cityNumber?: string

  @Field(() => String, { nullable: true })
  country?: string
}

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RskCompanyAddress {
  @Field(() => String, { nullable: true })
  streetAddress?: string

  @Field(() => String, { nullable: true })
  postalCode?: string

  @Field(() => String, { nullable: true })
  locality?: string

  @Field(() => String, { nullable: true })
  municipalityNumber?: string

  @Field(() => String, { nullable: true })
  country?: string
}

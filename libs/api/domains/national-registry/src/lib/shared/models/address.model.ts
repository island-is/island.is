import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('NationalRegistryAddress')
export class Address {
  @Field(() => ID, { nullable: true })
  code?: string | null

  @Field(() => String, { nullable: true })
  lastUpdated?: string | null

  @Field(() => String, { nullable: true })
  streetAddress?: string | null

  @Field(() => String, { nullable: true })
  apartment?: string | null

  @Field(() => String)
  city!: string

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  municipalityText?: string | null
}

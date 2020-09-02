import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Taxonomy {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  slug?: string

  @Field()
  description?: string
}

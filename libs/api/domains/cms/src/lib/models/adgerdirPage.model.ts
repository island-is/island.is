import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AdgerdirPage {
  @Field()
  id: string

  @Field()
  slug: string

  @Field()
  title: string

  @Field()
  description: string

  @Field({ nullable: true })
  content?: string
}

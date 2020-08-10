import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LinkCard {
  @Field()
  title: string

  @Field()
  body: string

  @Field()
  link: string

  @Field()
  linkText: string
}

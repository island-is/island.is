import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Link {
  @Field()
  text: string

  @Field()
  url: string
}

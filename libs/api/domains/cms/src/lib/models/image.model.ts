import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Image {
  @Field()
  url: string

  @Field()
  title: string

  @Field()
  contentType: string

  @Field(() => Int)
  width: number

  @Field(() => Int)
  height: number
}

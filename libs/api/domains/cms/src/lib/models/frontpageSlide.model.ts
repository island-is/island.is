import { Field, ObjectType } from '@nestjs/graphql'
import { Image } from './image.model'

@ObjectType()
export class FrontpageSlide {
  @Field()
  subtitle: string

  @Field()
  title: string

  @Field({ nullable: true })
  content?: string

  @Field(() => Image, { nullable: true })
  image?: Image
}

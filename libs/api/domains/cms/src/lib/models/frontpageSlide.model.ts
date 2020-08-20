import { Field, ObjectType } from '@nestjs/graphql'
import { Image } from './image.model'

@ObjectType()
export class FrontpageSlide {
  @Field({ nullable: true })
  subtitle?: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  content?: string

  @Field(() => Image, { nullable: true })
  image?: Image

  @Field({ nullable: true })
  link?: string
}

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Image } from './image.model'

@ObjectType()
export class LogoListSlice {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field(() => [Image])
  images: Image[]
}

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LinkCard } from './linkCard.model'
import { Image } from './image.model'

@ObjectType()
export class LogoListSlice {
  @Field(type => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field(type => [Image])
  images: Image[]
}

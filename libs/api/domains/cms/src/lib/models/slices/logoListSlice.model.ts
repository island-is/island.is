import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Image } from '../image.model'

@ObjectType()
export class LogoListSlice {
  constructor(initializer: LogoListSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field(() => [Image])
  images: Image[]
}

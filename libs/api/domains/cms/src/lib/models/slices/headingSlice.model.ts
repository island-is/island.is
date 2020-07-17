import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Story } from '../story.model'

@ObjectType()
export class HeadingSlice {
  constructor(initializer: HeadingSlice) {
    Object.assign(this, initializer);
  }

  @Field(type => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string
}

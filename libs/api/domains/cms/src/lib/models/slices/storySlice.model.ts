import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Story } from '../story.model'

@ObjectType()
export class StorySlice {
  constructor(initializer: StorySlice) {
    Object.assign(this, initializer);
  }

  @Field(type => ID)
  id: string

  @Field()
  readMoreText: string

  @Field(type => [Story])
  stories: Story[]
}

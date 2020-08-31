import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Story, mapStory } from '../story.model'
import { IStorySection } from '../../generated/contentfulTypes'

@ObjectType()
export class StorySlice {
  constructor(initializer: StorySlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  readMoreText: string

  @Field(() => [Story])
  stories: Story[]
}

export const mapStorySlice = ({ fields, sys }: IStorySection): StorySlice =>
  new StorySlice({
    id: sys.id,
    readMoreText: fields.readMoreText ?? '',
    stories: fields.stories.map(mapStory),
  })

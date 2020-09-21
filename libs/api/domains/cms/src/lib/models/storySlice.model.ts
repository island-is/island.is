import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IStorySection } from '../generated/contentfulTypes'

import { Story, mapStory } from './story.model'

@ObjectType()
export class StorySlice {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  readMoreText: string

  @Field(() => [Story])
  stories: Story[]
}

export const mapStorySlice = ({ fields, sys }: IStorySection): StorySlice => ({
  typename: 'StorySlice',
  id: sys.id,
  readMoreText: fields.readMoreText ?? '',
  stories: fields.stories.map(mapStory),
})

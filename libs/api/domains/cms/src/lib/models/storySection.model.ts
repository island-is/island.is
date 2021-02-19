import { Field, ObjectType } from '@nestjs/graphql'

import { IStorySection } from '../generated/contentfulTypes'

import { Story, mapStory } from './story.model'

@ObjectType()
export class StorySection {
  @Field()
  title: string

  @Field({ nullable: true })
  readMoreText?: string

  @Field(() => [Story])
  stories: Array<Story>
}

export const mapStorySection = ({ fields }: IStorySection): StorySection => ({
  title: fields.title,
  readMoreText: fields.readMoreText ?? '',
  stories: fields.stories.map(mapStory),
})

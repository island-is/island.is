import { Field, ID, ObjectType } from '@nestjs/graphql'

import { SystemMetadata } from '@island.is/shared/types'

import { IStorySection } from '../generated/contentfulTypes'

import { mapStory,Story } from './story.model'

@ObjectType()
export class StorySlice {
  @Field(() => ID)
  id!: string

  @Field()
  readMoreText?: string

  @Field(() => [Story])
  stories!: Story[]
}

export const mapStorySlice = ({
  fields,
  sys,
}: IStorySection): SystemMetadata<StorySlice> => ({
  typename: 'StorySlice',
  id: sys.id,
  readMoreText: fields.readMoreText ?? '',
  stories: (fields.stories ?? []).map(mapStory),
})

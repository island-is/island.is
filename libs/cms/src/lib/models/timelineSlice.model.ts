import { Field, ID, ObjectType } from '@nestjs/graphql'

import { SystemMetadata } from '@island.is/shared/types'

import { ITimeline } from '../generated/contentfulTypes'

import { mapTimelineEvent,TimelineEvent } from './timelineEvent.model'

@ObjectType()
export class TimelineSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  intro?: string

  @Field(() => [TimelineEvent])
  events!: TimelineEvent[]
}

export const mapTimelineSlice = ({
  fields,
  sys,
}: ITimeline): SystemMetadata<TimelineSlice> => ({
  typename: 'TimelineSlice',
  id: sys.id,
  title: fields.title ?? '',
  intro: fields.intro ?? '',
  events: (fields.events ?? []).map(mapTimelineEvent),
})

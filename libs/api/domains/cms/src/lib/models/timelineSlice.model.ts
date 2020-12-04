import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ITimeline } from '../generated/contentfulTypes'
import { SystemMetadata } from '../types'
import { TimelineEvent, mapTimelineEvent } from './timelineEvent.model'

@ObjectType()
export class TimelineSlice {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [TimelineEvent])
  events: TimelineEvent[]
}

export const mapTimelineSlice = ({
  fields,
  sys,
}: ITimeline): SystemMetadata<TimelineSlice> => ({
  typename: 'TimelineSlice',
  id: sys.id,
  title: fields.title ?? '',
  events: (fields.events ?? []).map(mapTimelineEvent),
})

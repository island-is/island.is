import { Field, ID, ObjectType } from '@nestjs/graphql'
import { TimelineEvent, mapTimelineEvent } from '../timelineEvent.model'
import { ITimeline } from '../../generated/contentfulTypes'

@ObjectType()
export class TimelineSlice {
  constructor(initializer: TimelineSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [TimelineEvent])
  events: TimelineEvent[]
}

export const mapTimelineSlice = ({ fields, sys }: ITimeline): TimelineSlice =>
  new TimelineSlice({
    id: sys.id,
    title: fields.title ?? '',
    events: fields.events.map(mapTimelineEvent),
  })

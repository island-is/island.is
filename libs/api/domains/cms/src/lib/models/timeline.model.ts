import { Field, ObjectType } from '@nestjs/graphql'

import { ITimeline } from '../generated/contentfulTypes'

import { TimelineEvent, mapTimelineEvent } from './timelineEvent.model'

@ObjectType()
export class Timeline {
  @Field({ nullable: true })
  title?: string

  @Field(() => [TimelineEvent])
  events: Array<TimelineEvent>
}

export const mapTimeline = ({ fields }: ITimeline): Timeline => ({
  title: fields.title ?? '',
  events: fields.events.map(mapTimelineEvent),
})

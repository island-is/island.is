import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { ITimeline } from '../generated/contentfulTypes'
import { TimelineEvent, mapTimelineEvent } from './timelineEvent.model'
import { getArrayOrEmptyArrayFallback } from './utils'

@ObjectType()
export class TimelineSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  intro?: string

  @CacheField(() => [TimelineEvent])
  events!: TimelineEvent[]

  @Field(() => Boolean, { nullable: true })
  hasBorderAbove?: boolean
}

export const mapTimelineSlice = ({
  fields,
  sys,
}: ITimeline): SystemMetadata<TimelineSlice> => ({
  typename: 'TimelineSlice',
  id: sys.id,
  title: fields.title ?? '',
  intro: fields.intro ?? '',
  events: getArrayOrEmptyArrayFallback(fields.events).map(mapTimelineEvent),
  hasBorderAbove: fields.hasBorderAbove ?? true,
})

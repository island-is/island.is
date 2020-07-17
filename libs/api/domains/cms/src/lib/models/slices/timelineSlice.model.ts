import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { TimelineEvent } from '../timelineEvent.model'

@ObjectType()
export class TimelineSlice {
  constructor(initializer: TimelineSlice) {
    Object.assign(this, initializer)
  }

  @Field((type) => ID)
  id: string

  @Field()
  title: string

  @Field((type) => [TimelineEvent])
  events: TimelineEvent[]
}

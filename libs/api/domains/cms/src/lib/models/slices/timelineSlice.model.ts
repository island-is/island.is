import { Field, ID, ObjectType } from '@nestjs/graphql'
import { TimelineEvent } from '../timelineEvent.model'

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

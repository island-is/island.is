import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { Event as EventModel } from './event.model'

@ObjectType()
export class EventList {
  @Field(() => Int)
  total!: number

  @CacheField(() => [EventModel])
  items!: EventModel[]
}

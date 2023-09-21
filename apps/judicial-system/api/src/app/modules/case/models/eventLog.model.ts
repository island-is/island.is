import { Field, ID, ObjectType } from '@nestjs/graphql'

import {
  EventLog as TEventLog,
  EventType,
} from '@island.is/judicial-system/types'

@ObjectType()
export class EventLog implements TEventLog {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly caseId?: string

  @Field(() => EventType)
  readonly eventType!: EventType

  @Field()
  readonly nationalId?: string

  @Field()
  readonly userRole?: string
}

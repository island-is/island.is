import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { EventType } from '@island.is/judicial-system/types'

registerEnumType(EventType, { name: 'EventType' })

@ObjectType()
export class EventLog {
  @Field(() => ID)
  readonly id!: string

  @Field({ nullable: true })
  readonly created?: string

  @Field({ nullable: true })
  readonly caseId?: string

  @Field(() => EventType, { nullable: true })
  readonly eventType?: EventType

  @Field({ nullable: true })
  readonly nationalId?: string

  @Field({ nullable: true })
  readonly userRole?: string
}

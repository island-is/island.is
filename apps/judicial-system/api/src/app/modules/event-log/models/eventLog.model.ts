import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { EventType, UserRole } from '@island.is/judicial-system/types'

registerEnumType(EventType, { name: 'EventType' })

@ObjectType()
export class EventLog {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => EventType, { nullable: true })
  readonly eventType?: EventType

  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => UserRole, { nullable: true })
  readonly userRole?: UserRole
}

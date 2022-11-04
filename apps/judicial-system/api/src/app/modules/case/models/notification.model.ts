import { Field, ID, ObjectType } from '@nestjs/graphql'

import type {
  Notification as TNotification,
  NotificationType,
} from '@island.is/judicial-system/types'

@ObjectType()
export class Notification implements TNotification {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly caseId!: string

  @Field(() => String)
  readonly type!: NotificationType

  @Field({ nullable: true })
  readonly recipients?: string
}

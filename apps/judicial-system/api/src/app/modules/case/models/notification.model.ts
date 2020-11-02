import { Field, ID, ObjectType } from '@nestjs/graphql'

import {
  Notification as TNotification,
  NotificationType,
} from '@island.is/judicial-system/types'

@ObjectType()
export class Notification implements TNotification {
  @Field(() => ID)
  readonly id: string

  @Field()
  created: string

  @Field()
  caseId: string

  @Field(() => String)
  type: NotificationType

  @Field()
  message: string
}

import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type {
  NotificationType,
  SendNotification,
} from '@island.is/judicial-system/types'

@InputType()
export class SendNotificationInput implements SendNotification {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field(() => String)
  readonly type!: NotificationType
}

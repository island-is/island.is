import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { TrackedNotificationType } from '@island.is/judicial-system/types'

@InputType()
export class SendNotificationInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => TrackedNotificationType)
  readonly type!: TrackedNotificationType
}

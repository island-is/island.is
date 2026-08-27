import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { TrackedNotificationType } from '@island.is/judicial-system/types'

@InputType()
export class SendAppealNotificationInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCaseId!: string

  @Allow()
  @Field(() => TrackedNotificationType)
  readonly type!: TrackedNotificationType
}

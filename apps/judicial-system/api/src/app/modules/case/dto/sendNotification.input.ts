import { Allow, IsOptional } from 'class-validator'

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

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly eventOnly?: boolean
}

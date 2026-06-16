import { Allow, IsOptional } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'

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

  // Generic key/value context for notification-specific data. For appeal case
  // notifications this carries an `appealCaseId` identifying which appeal case
  // the notification is about.
  @Allow()
  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly properties?: { [key: string]: string }
}

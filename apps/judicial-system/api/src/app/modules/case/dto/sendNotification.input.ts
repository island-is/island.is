import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { NotificationType } from '@island.is/judicial-system/types'

@InputType()
export class SendNotificationInput {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field(() => NotificationType)
  readonly type!: NotificationType

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly eventOnly?: boolean
}

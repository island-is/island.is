import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { NotificationType } from '@island.is/judicial-system/types'

@InputType()
export class SendNotificationInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => NotificationType)
  readonly type!: NotificationType

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly eventOnly?: boolean
}

import { Allow } from 'class-validator'

import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql'

import { AppealEventType } from '@island.is/judicial-system/types'

registerEnumType(AppealEventType, { name: 'AppealEventType' })

@InputType()
export class CreateAppealEventLogInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly appealCaseId!: string

  @Allow()
  @Field(() => AppealEventType)
  readonly eventType!: AppealEventType
}

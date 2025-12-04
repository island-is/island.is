import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class SpeedingViolationInfoQueryInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string
}

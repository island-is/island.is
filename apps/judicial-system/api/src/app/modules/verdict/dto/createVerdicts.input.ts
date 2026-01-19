import { Allow, IsArray, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
class CreateVerdict {
  @Allow()
  @Field(() => ID)
  readonly defendantId!: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isDefaultJudgement?: boolean

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isDrivingLicenseSuspended?: boolean
}

@InputType()
export class CreateVerdictsInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsOptional()
  @IsArray()
  @Field(() => [CreateVerdict], { nullable: true })
  readonly verdicts?: CreateVerdict[]
}

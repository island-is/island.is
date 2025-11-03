import { Field, ID, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { AppealDecision } from '../models/verdict.model'

@InputType('LawAndOrderAppealDecisionInput')
export class PostAppealDecisionInput {
  @Field(() => ID)
  @IsString()
  caseId!: string

  @Field(() => AppealDecision)
  choice!: AppealDecision
}

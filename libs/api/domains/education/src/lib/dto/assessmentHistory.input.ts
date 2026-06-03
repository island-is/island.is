import { Allow } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType('EducationPrimarySchoolAssessmentHistoryInput')
export class AssessmentHistoryInput {
  @Allow()
  @Field({ nullable: true })
  readonly assessmentId?: string
}

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PrimarySchoolAssessmentResult } from './primarySchoolAssessmentResult.model'

@ObjectType('EducationPrimarySchoolAssessment')
export class PrimarySchoolAssessment {
  @Field(() => ID)
  id!: string

  @Field({
    nullable: true,
    description:
      'Short code used to identify the assessment type in the upstream MMS system (e.g. "LF1", "ST2"). Distinct from the UUID id.',
  })
  identifier?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [PrimarySchoolAssessmentResult], { nullable: true })
  resultHistory?: PrimarySchoolAssessmentResult[]

  // Internal — threads studentId through to the field resolver, not exposed in GraphQL
  studentId?: string
}

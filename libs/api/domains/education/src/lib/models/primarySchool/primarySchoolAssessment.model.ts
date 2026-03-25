import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PrimarySchoolAssessmentResult } from './primarySchoolAssessmentResult.model'

@ObjectType('EducationPrimarySchoolAssessment')
export class PrimarySchoolAssessment {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
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

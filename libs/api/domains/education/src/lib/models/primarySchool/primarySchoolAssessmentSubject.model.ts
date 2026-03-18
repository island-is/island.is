import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PrimarySchoolAssessmentType } from './primarySchoolAssessmentType.model'

@ObjectType('EducationPrimarySchoolAssessmentSubject')
export class PrimarySchoolAssessmentSubject {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  identifier?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [PrimarySchoolAssessmentType], { nullable: true })
  assessmentTypes?: PrimarySchoolAssessmentType[]
}

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PrimarySchoolAssessmentGrade } from './primarySchoolAssessmentGrade.model'
import { PrimarySchoolAssessmentPeriod } from './primarySchoolAssessmentPeriod.model'

@ObjectType('EducationPrimarySchoolAssessmentResult')
export class PrimarySchoolAssessmentResult {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  schoolYear?: string

  @Field(() => PrimarySchoolAssessmentGrade, { nullable: true })
  grade?: PrimarySchoolAssessmentGrade

  @Field(() => PrimarySchoolAssessmentPeriod, { nullable: true })
  period?: PrimarySchoolAssessmentPeriod

  @Field({
    nullable: true,
    description:
      'Pre-built URL for downloading the PDF result from the Download Service. Ready to use directly as a link or form action.',
  })
  downloadServiceUrl?: string
}

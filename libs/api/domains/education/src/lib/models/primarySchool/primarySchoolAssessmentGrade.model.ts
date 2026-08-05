import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationPrimarySchoolAssessmentGrade')
export class PrimarySchoolAssessmentGrade {
  @Field(() => Int, {
    description: 'School year grade level as an integer (e.g. 1–10).',
  })
  level!: number

  @Field({ nullable: true })
  name?: string
}

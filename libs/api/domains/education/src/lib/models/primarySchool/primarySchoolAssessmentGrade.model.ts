import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationPrimarySchoolAssessmentGrade')
export class PrimarySchoolAssessmentGrade {
  @Field(() => Int)
  level!: number

  @Field({ nullable: true })
  name?: string
}

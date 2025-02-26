import { Field, ObjectType } from '@nestjs/graphql'
import { GradeCategory } from './gradeCategory.model'
import { PrimarySchoolGrade } from './grade.model'

@ObjectType('EducationPrimarySchoolGradeCategoryWeighted', {
  implements: () => GradeCategory,
})
export class GradeCategoryWeighted implements GradeCategory {
  @Field()
  label!: string

  @Field(() => PrimarySchoolGrade)
  grade!: PrimarySchoolGrade
}

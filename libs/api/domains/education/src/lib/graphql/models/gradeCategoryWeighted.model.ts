import { Field, ObjectType } from '@nestjs/graphql'
import { GradeCategory } from './gradeCategory.model'
import { Grade } from './grade.model'

@ObjectType('EducationCompulsorySchoolGradeCategoryWeighted', {
  implements: () => GradeCategory,
})
export class GradeCategoryWeighted implements GradeCategory {
  @Field()
  label!: string

  @Field(() => Grade)
  grade!: Grade
}

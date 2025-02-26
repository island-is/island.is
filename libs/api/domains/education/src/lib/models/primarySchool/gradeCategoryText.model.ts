import { Field, ObjectType } from '@nestjs/graphql'
import { GradeCategory } from './gradeCategory.model'

@ObjectType('EducationPrimarySchoolGradeCategoryText', {
  implements: () => GradeCategory,
})
export class GradeCategoryText implements GradeCategory {
  @Field()
  label!: string

  @Field()
  text!: string
}

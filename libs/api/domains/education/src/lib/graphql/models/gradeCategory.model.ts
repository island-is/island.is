import { Field, InterfaceType } from '@nestjs/graphql'
import { GradeCategoryText } from './gradeCategoryText.model'
import { GradeCategoryWeighted } from './gradeCategoryWeighted.model'

@InterfaceType('EducationPrimarySchoolGradeCategory', {
  resolveType(res) {
    if (res.text) {
      return GradeCategoryText
    }

    return GradeCategoryWeighted
  },
})
export abstract class GradeCategory {
  @Field()
  label!: string
}

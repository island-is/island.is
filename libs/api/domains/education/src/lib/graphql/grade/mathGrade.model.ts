import { Field, ObjectType } from '@nestjs/graphql'

import { Grade } from './grade.model'
import { GradeType } from './gradeType.model'

@ObjectType('EducationMathGrade')
export class MathGrade {
  @Field(() => String)
  label!: string

  @Field(() => GradeType)
  grade!: GradeType

  @Field(() => String)
  competence!: string

  @Field(() => String)
  competenceStatus!: string

  @Field(() => GradeType)
  calculation!: GradeType

  @Field(() => GradeType)
  geometry!: GradeType

  @Field(() => GradeType)
  ratiosAndPercentages!: GradeType

  @Field(() => GradeType)
  algebra!: GradeType

  @Field(() => GradeType)
  numberComprehension!: GradeType

  @Field(() => Grade)
  wordAndNumbers!: Grade

  @Field(() => Grade)
  progressText!: Grade
}

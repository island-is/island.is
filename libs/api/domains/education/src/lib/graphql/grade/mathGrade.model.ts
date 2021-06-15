import { Field, ObjectType } from '@nestjs/graphql'

import { Grade } from './grade.model'

@ObjectType('EducationMathGrade')
export class MathGrade {
  @Field(() => String)
  grade!: string

  @Field(() => String)
  competence!: string

  @Field(() => String)
  competenceStatus!: string

  @Field(() => Grade)
  calculation!: Grade

  @Field(() => Grade)
  geometry!: Grade

  @Field(() => Grade)
  ratiosAndPercentages!: Grade

  @Field(() => Grade)
  algebra!: Grade

  @Field(() => Grade)
  numberComprehension!: Grade

  @Field(() => String)
  wordAndNumbers!: string

  @Field(() => String)
  progressText!: string
}

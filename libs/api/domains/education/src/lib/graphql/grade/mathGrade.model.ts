import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Grade } from './grade.model'

@ObjectType('EducationMathGrade')
export class MathGrade {
  @Field(() => ID)
  id!: number

  @Field(() => Grade)
  calculation!: typeof Grade

  @Field(() => Grade)
  geometry!: typeof Grade

  @Field(() => Grade)
  numberComprehension!: typeof Grade

  @Field(() => Grade)
  ratiosAndPercentages?: typeof Grade

  @Field(() => Grade)
  algebra?: typeof Grade

  @Field(() => Grade)
  grade!: typeof Grade
}

import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Grade } from './grade.model'

@ObjectType()
export class GradeType {
  @Field(() => Grade)
  serialGrade!: Grade

  @Field(() => Grade)
  elementaryGrade!: Grade
}

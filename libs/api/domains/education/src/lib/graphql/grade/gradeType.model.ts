import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Grade } from './grade.model'

@ObjectType()
export class GradeType {
  @Field(() => String)
  label!: string

  @Field(() => Grade, { nullable: true })
  serialGrade?: Grade

  @Field(() => Grade, { nullable: true })
  elementaryGrade?: Grade
}

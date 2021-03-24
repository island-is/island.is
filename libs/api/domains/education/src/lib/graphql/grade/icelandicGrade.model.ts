import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Grade } from './grade.model'

@ObjectType('EducationIcelandicGrade')
export class IcelandicGrade {
  @Field(() => ID)
  id!: number

  @Field(() => Grade)
  readingGrade!: typeof Grade

  @Field(() => Grade)
  grammarGrade!: typeof Grade

  @Field(() => Grade)
  writingGrade?: typeof Grade

  @Field(() => Grade)
  grade!: typeof Grade
}

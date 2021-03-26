import { Field, ObjectType } from '@nestjs/graphql'

import { Grade } from './grade.model'

@ObjectType('EducationIcelandicGrade')
export class IcelandicGrade {
  @Field(() => String)
  grade!: string

  @Field(() => String)
  competence!: string

  @Field(() => String)
  competenceStatus!: string

  @Field(() => Grade)
  readingGrade!: Grade

  @Field(() => Grade)
  grammarGrade!: Grade

  @Field(() => String)
  progressText!: string
}

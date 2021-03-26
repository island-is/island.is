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
  reading!: Grade

  @Field(() => Grade)
  grammar!: Grade

  @Field(() => String)
  progressText!: string
}

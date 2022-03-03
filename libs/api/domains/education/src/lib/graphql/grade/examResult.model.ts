import { Field, ID,ObjectType } from '@nestjs/graphql'

import { GradeResult } from './gradeResult.model'

@ObjectType('EducationExamResult')
export class ExamResult {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  fullName!: string

  @Field(() => [GradeResult])
  grades!: GradeResult[]
}

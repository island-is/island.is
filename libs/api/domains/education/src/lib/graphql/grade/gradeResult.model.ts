import { Field, ObjectType } from '@nestjs/graphql'

import { IcelandicGrade } from './icelandicGrade.model'
import { EnglishGrade } from './englishGrade.model'
import { MathGrade } from './mathGrade.model'

@ObjectType('EducationGradeResult')
export class GradeResult {
  @Field(() => String)
  studentYear!: string

  @Field(() => IcelandicGrade, { nullable: true })
  icelandicGrade?: IcelandicGrade

  @Field(() => MathGrade, { nullable: true })
  mathGrade?: MathGrade

  @Field(() => EnglishGrade, { nullable: true })
  englishGrade?: EnglishGrade
}

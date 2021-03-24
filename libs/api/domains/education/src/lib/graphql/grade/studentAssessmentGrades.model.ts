import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IcelandicGrade } from './icelandicGrade.model'
import { EnglishGrade } from './englishGrade.model'
import { MathGrade } from './mathGrade.model'

@ObjectType('EducationStudentAssessmentGrades')
export class StudentAssessmentGrades {
  @Field(() => ID)
  id!: number

  @Field(() => IcelandicGrade)
  icelandicGrade!: typeof IcelandicGrade

  @Field(() => MathGrade)
  mathGrade!: typeof MathGrade

  @Field(() => EnglishGrade)
  englishGrade!: typeof EnglishGrade
}

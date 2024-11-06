import { Field, ObjectType } from '@nestjs/graphql'
import { GradeDetail } from './gradeDetail.model'

@ObjectType('EducationCompulsorySchoolGrade')
export class Grade {
  @Field(() => GradeDetail)
  compulsorySchoolGrade!: GradeDetail

  @Field(() => GradeDetail, { description: 'National standardised test grade' })
  serialGrade!: GradeDetail
}

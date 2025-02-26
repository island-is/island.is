import { Field, ObjectType } from '@nestjs/graphql'
import { GradeDetail } from './gradeDetail.model'

@ObjectType('EducationPrimarySchoolGrade')
export class PrimarySchoolGrade {
  @Field(() => GradeDetail)
  primarySchoolGrade!: GradeDetail

  @Field(() => GradeDetail, { description: 'National standardised test grade' })
  serialGrade!: GradeDetail
}

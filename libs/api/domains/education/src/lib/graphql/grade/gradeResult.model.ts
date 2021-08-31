import { Field, ObjectType } from '@nestjs/graphql'

import { CourseGrade } from './courseGrade.model'

@ObjectType('EducationGradeResult')
export class GradeResult {
  @Field(() => String)
  studentYear!: string

  @Field(() => [CourseGrade])
  courses: CourseGrade[]
}

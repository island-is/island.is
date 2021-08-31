import { Field, ObjectType } from '@nestjs/graphql'

import { Grade } from './grade.model'
import { GradeType } from './gradeType.model'

@ObjectType('EducationCourseGrade')
export class CourseGrade {
  @Field(() => String)
  label!: string

  @Field(() => GradeType, { nullable: true })
  gradeSum?: GradeType

  @Field(() => String)
  competence!: string

  @Field(() => String)
  competenceStatus!: string

  @Field(() => [GradeType])
  grades!: GradeType[]

  @Field(() => Grade, { nullable: true })
  wordAndNumbers?: Grade

  @Field(() => Grade, { nullable: true })
  progressText?: Grade
}

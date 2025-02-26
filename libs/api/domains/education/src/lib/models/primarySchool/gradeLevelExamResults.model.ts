import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PrimarySchoolCourse } from './course.model'

@ObjectType('EducationPrimarySchoolGradeLevelExamResults')
export class PrimarySchoolGradeLevelExamResults {
  @Field(() => Int)
  gradeLevel!: number

  @Field(() => [PrimarySchoolCourse], { nullable: true })
  coursesExamResults?: Array<PrimarySchoolCourse>
}

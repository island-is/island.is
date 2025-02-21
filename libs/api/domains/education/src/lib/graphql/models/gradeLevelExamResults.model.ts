import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Course } from './course.model'

@ObjectType('EducationPrimarySchoolGradeLevelExamResults')
export class PrimarySchoolGradeLevelExamResults {
  @Field(() => Int)
  gradeLevel!: number

  @Field(() => [Course], { nullable: true })
  coursesExamResults?: Array<Course>
}

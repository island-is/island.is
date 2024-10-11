import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Course } from './course.model'

@ObjectType('EducationCompulsorySchoolGradeLevelExamResults')
export class CompulsorySchoolGradeLevelExamResults {
  @Field(() => Int)
  gradeLevel!: number

  @Field(() => [Course], { nullable: true })
  coursesExamResults?: Array<Course>
}

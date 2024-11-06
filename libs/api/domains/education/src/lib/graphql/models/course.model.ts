import { Field, ObjectType } from '@nestjs/graphql'
import { CourseCompetence } from './competence.model'
import { GradeCategory } from './gradeCategory.model'
import { Grade } from './grade.model'

@ObjectType('EducationCompulsorySchoolCourse')
export class Course {
  @Field()
  label!: string

  @Field(() => Grade, { nullable: true })
  totalGrade?: Grade

  @Field(() => CourseCompetence)
  competence!: CourseCompetence

  @Field(() => [GradeCategory], { nullable: true })
  gradeCategories!: Array<GradeCategory>
}

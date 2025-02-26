import { Field, ObjectType } from '@nestjs/graphql'
import { CourseCompetence } from './competence.model'
import { GradeCategory } from './gradeCategory.model'
import { PrimarySchoolGrade } from './grade.model'

@ObjectType('EducationPrimarySchoolCourse')
export class PrimarySchoolCourse {
  @Field()
  label!: string

  @Field(() => PrimarySchoolGrade, { nullable: true })
  totalGrade?: PrimarySchoolGrade

  @Field(() => CourseCompetence)
  competence!: CourseCompetence

  @Field(() => [GradeCategory], { nullable: true })
  gradeCategories!: Array<GradeCategory>
}

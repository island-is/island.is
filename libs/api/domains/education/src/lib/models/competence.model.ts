import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationCompulsorySchoolCourseCompetence')
export class CourseCompetence {
  @Field() //B+
  competencyGrade!: string

  @Field({ nullable: true }) // A1
  competenceStatus?: string
}

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationCompulsorySchoolCourseCompetence')
export class CourseCompetence {
  @Field()
  competencyGrade!: string

  @Field({ nullable: true })
  competenceStatus?: string
}

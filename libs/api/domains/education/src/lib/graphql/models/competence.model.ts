import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationPrimarySchoolCourseCompetence')
export class CourseCompetence {
  @Field()
  competencyGrade!: string

  @Field({ nullable: true })
  competenceStatus?: string
}

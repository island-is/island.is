import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class StudentAssessment {
  @Field({ nullable: true })
  studentNationalId?: string

  @Field({ nullable: true })
  teacherNationalId?: string

  @Field({ nullable: true })
  teacherName?: string
}

import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class StudentAssessment {
  @Field({ nullable: true })
  studentNationalId!: string | null

  @Field({ nullable: true })
  teacherNationalId!: string | null

  @Field({ nullable: true })
  teacherName!: string | null
}

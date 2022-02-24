import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StudentListTeacherNationalIdResponse {
  @Field(() => [Student], { nullable: true })
  data?: Student[]

  @Field({ nullable: true })
  nextCursor?: string
}

@ObjectType()
export class Student {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  totalLessonCount?: number
}

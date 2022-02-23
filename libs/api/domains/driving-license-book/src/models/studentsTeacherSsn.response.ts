import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StudentListTeacherSsnResponse {
  @Field(() => [Student], { nullable: true })
  data?: Student[]

  @Field({ nullable: true })
  nextCursor?: string
}

@ObjectType()
export class Student {
  @Field(() => ID,{ nullable: true })
  id?: string

  @Field({ nullable: true })
  ssn?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  totalLessonCount?: number
}

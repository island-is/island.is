import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StudentListTeacherSsnResponse {
  @Field(() => [Student], { nullable: true })
  data?: Student[] | null

  @Field({ nullable: true })
  nextCursor?: string | null
}

@ObjectType()
export class Student {
  @Field({ nullable: true })
  id?: string | null

  @Field({ nullable: true })
  ssn?: string | null

  @Field({ nullable: true })
  name?: string | null

  @Field({ nullable: true })
  totalLessonCount?: number | null
}

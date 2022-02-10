import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class Lesson {
  @Field({ nullable: true })
  id!: string

  @Field({ nullable: true })
  registerDate?: string

  @Field({ nullable: true })
  lessonTime?: number

  @Field({ nullable: true })
  teacherSsn?: string

  @Field({ nullable: true })
  teacherName?: string

  @Field({ nullable: true })
  comments?: string
}

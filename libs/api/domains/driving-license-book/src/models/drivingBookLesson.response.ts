import { Field, ID, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class DrivingBookLesson {
  @Field(() => ID, { nullable: true })
  id!: string

  @Field({ nullable: true })
  registerDate?: string

  @Field({ nullable: true })
  lessonTime?: number

  @Field({ nullable: true })
  teacherNationalId?: string

  @Field({ nullable: true })
  teacherName?: string

  @Field({ nullable: true })
  comments?: string
}

import { Field, ID, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class DrivingBookLesson {
  @Field(() => ID)
  id!: string

  @Field()
  registerDate!: string

  @Field()
  lessonTime!: number

  @Field()
  teacherNationalId!: string

  @Field()
  teacherName!: string

  @Field()
  comments!: string
}

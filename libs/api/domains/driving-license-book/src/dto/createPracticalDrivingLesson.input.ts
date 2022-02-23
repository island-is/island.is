import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePracticalDrivingLesson {
  @Field()
  bookId!: string

  @Field()
  teacherSsn!: string

  @Field()
  minutes!: number

  @Field()
  createdOn!: string

  @Field({ nullable: true })
  comments?: string
}

@InputType()
export class CreatePracticalDrivingLessonInput {
  @Field(() => CreatePracticalDrivingLesson)
  practicalDrivingLessonCreateRequestBody?: CreatePracticalDrivingLesson
}

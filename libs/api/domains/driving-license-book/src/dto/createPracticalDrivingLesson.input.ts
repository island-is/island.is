import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePracticalDrivingLessonInput {
  @Field()
  bookId!: string

  @Field()
  teacherNationalId!: string

  @Field()
  minutes!: number

  @Field()
  createdOn!: string

  @Field({ nullable: true })
  comments?: string
}

import { IsString, IsNumber, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdatePracticalDrivingLesson {
  @Field()
  minutes!: number

  @Field()
  createdOn!: string

  @Field({ nullable: true })
  comments?: string
}

@InputType()
export class UpdatePracticalDrivingLessonInput {
  id!: string

  @Field(() => UpdatePracticalDrivingLesson)
  practicalDrivingLessonUpdateRequestBody?: UpdatePracticalDrivingLesson
}

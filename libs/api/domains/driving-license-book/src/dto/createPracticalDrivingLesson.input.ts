import { IsString, IsNumber, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePracticalDrivingLesson {
  @Field()
  @IsString()
  bookId!: string

  @Field()
  @IsString()
  teacherSsn!: string

  @Field()
  @IsNumber()
  minutes!: number

  @Field()
  @IsString()
  createdOn!: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  comments?: string
}

@InputType()
export class CreatePracticalDrivingLessonInput {
  @Field(() => CreatePracticalDrivingLesson)
  practicalDrivingLessonCreateRequestBody?: CreatePracticalDrivingLesson
}

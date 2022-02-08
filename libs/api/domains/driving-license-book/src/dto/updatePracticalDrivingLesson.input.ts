import { IsString, IsNumber, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdatePracticalDrivingLesson {
  @Field()
  @IsNumber()
  minutes!: number

  @Field()
  @IsString()
  createdOn!: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  comments?: string | null
}

@InputType()
export class UpdatePracticalDrivingLessonInput {
  @Field()
  @IsString()
  id!: string

  @Field(() => UpdatePracticalDrivingLesson)
  practicalDrivingLessonUpdateRequestBody?: UpdatePracticalDrivingLesson
}

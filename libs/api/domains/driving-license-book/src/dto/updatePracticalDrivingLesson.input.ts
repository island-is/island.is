import { IsString, IsNumber, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdatePracticalDrivingLessonInput {
  @Field()
  id!: string

  @Field()
  bookId!: string

  @Field()
  minutes!: number

  @Field()
  createdOn!: string

  @Field()
  comments!: string
}

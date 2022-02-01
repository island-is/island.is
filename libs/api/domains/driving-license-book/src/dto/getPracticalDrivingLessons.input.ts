import { IsString, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PracticalDrivingLessonsInput {
  @Field({ nullable: true })
  @IsString()
  bookId!: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  id?: string

}

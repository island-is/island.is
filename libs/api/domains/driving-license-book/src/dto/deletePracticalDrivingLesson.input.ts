import { IsString, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeletePracticalDrivingLessonInput {
  @Field()
  @IsString()
  id!: string

  @Field()
  @IsString()
  @IsOptional()
  reason?: string
}

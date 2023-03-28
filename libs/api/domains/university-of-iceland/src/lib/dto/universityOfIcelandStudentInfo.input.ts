import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class UniversityOfIcelandStudentInfoQueryInput {
  @Field()
  @IsNumber()
  @IsOptional()
  trackNumber?: number

  @Field()
  @IsString()
  locale!: string
}

import { IsString, IsNumber, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class StudentListInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  key?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  licenseCategory?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  cursor?: string

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number
}

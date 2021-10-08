import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNumber, IsOptional } from 'class-validator'

@InputType()
export class PaginationInput {

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  before?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  after?: string
}

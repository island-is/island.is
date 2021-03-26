import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'

@InputType()
export class GetRegulationsNewestInput {
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number
}

import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'

@InputType()
export class GetRegulationsSearchInput {
  @Field({ nullable: true })
  @IsOptional()
  q?: string

  @Field({ nullable: true })
  @IsOptional()
  rn?: string

  @Field({ nullable: true })
  @IsOptional()
  ch?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2150)
  year?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2150)
  yearTo?: number
}

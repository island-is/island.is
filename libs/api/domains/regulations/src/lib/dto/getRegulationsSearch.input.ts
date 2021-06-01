import type { Year } from '@island.is/clients/regulations'
import { Field, InputType, Int } from '@nestjs/graphql'
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

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2150)
  year?: Year

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2150)
  yearTo?: Year
}

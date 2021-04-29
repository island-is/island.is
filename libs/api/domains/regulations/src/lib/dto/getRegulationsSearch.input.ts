import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

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
  year?: string

  @Field({ nullable: true })
  @IsOptional()
  ch?: string
}

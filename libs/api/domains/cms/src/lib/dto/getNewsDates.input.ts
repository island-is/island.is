import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetNewsDatesInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string

  @Field({ nullable: true })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc'
}

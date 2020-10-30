import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetNewsDatesInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string = 'is'

  @Field({ nullable: true })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc'

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  tag?: string
}

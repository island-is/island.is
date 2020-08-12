import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { ContentLanguage } from '../enums/contentLanguage.enum'

@InputType()
export class SearcherInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  queryString?: string

  @Field(() => ContentLanguage, { nullable: true })
  @IsEnum(ContentLanguage)
  @IsOptional()
  language?: ContentLanguage

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  page?: number
}

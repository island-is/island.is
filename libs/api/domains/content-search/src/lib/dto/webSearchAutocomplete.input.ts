import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEnum, IsInt, IsString, IsOptional } from 'class-validator'
import { ContentLanguage } from '../enums/contentLanguage.enum'

@InputType()
export class WebSearchAutocompleteInput {
  @Field()
  @IsString()
  queryString: string

  @Field(() => ContentLanguage, { nullable: true })
  @IsEnum(ContentLanguage)
  @IsOptional()
  language: ContentLanguage = ContentLanguage.is

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size: number = 10
}

import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsString, IsOptional } from 'class-validator'
import { ContentLanguage } from '../enums/contentLanguage.enum'

@InputType()
export class WebSearchAutocompleteSuggestionsInput {
  @Field()
  @IsString()
  searchQuery: string

  @Field(() => ContentLanguage, { nullable: true })
  @IsEnum(ContentLanguage)
  @IsOptional()
  language: ContentLanguage = ContentLanguage.is
}

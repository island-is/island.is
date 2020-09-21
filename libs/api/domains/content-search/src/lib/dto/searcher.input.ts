import { Field, InputType, Int } from '@nestjs/graphql'
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { ContentLanguage } from '../enums/contentLanguage.enum'
import { SearchableContentTypes } from '../enums/searchableContentTypes'

@InputType()
export class SearcherInput {
  @Field(() => String)
  @IsString()
  queryString: string

  @Field(() => [SearchableContentTypes], { nullable: true })
  @IsArray()
  @IsOptional()
  types?: SearchableContentTypes[] = Object.values(SearchableContentTypes)

  @Field(() => ContentLanguage, { nullable: true })
  @IsEnum(ContentLanguage)
  @IsOptional()
  language?: ContentLanguage = ContentLanguage.is

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  page?: number
}

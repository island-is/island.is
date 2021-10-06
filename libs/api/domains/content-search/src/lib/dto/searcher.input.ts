import { Field, InputType, Int } from '@nestjs/graphql'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator'
import { ContentLanguage } from '../enums/contentLanguage.enum'
import { SearchableContentTypes } from '../enums/searchableContentTypes'
import { SearchableTags } from '../enums/searchableTags'

@InputType()
export class Tag {
  @Field(() => SearchableTags)
  type: SearchableTags

  @Field(() => String)
  key: string
}

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

  @Field(() => [Tag], { nullable: true })
  @IsArray()
  @IsOptional()
  tags?: Tag[]

  @Field(() => SearchableTags, { nullable: true })
  @IsEnum(SearchableTags)
  @IsOptional()
  countTag?: SearchableTags

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  countTypes?: boolean = false

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  fuzzy?: boolean = false

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  fuzzyFactor?: number = 1
}

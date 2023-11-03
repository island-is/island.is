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
import { SortField, SortDirection } from '@island.is/content-search-toolkit'

@InputType()
export class Tag {
  @Field(() => SearchableTags)
  type!: SearchableTags

  @Field(() => String)
  key!: string
}

@InputType()
export class SearcherInput {
  @Field(() => String)
  @IsString()
  queryString!: string

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

  @Field(() => [Tag], { nullable: true })
  @IsArray()
  @IsOptional()
  excludedTags?: Tag[]

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  contentfulTags?: string[]

  @Field(() => [SearchableTags], { nullable: true })
  @IsArray()
  @IsOptional()
  countTag?: SearchableTags[] = Object.values(SearchableTags)

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  countTypes?: boolean = false

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  countProcessEntry?: boolean = false

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  highlightResults?: boolean = false

  @Field(() => String, { nullable: true })
  @IsOptional()
  useQuery?: string = 'default'

  @Field(() => SortField, { nullable: true })
  @IsOptional()
  sort?: SortField

  @Field(() => SortDirection, { nullable: true })
  @IsOptional()
  order?: SortDirection = SortDirection.DESC
}

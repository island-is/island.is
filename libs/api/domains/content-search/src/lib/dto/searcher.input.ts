import { Field, InputType, Int } from '@nestjs/graphql'
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
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

/*
@Scalar('Tag', type => Tag)
export class TagScalar implements CustomScalar<string, Tag> {
  description = 'Date custom scalar type';

  parseValue(value: string): Tag {
    return JSON.parse(value)
  }

  serialize(value: Tag): string {
    return JSON.stringify(value)
  }
}*/

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
  countTag: SearchableTags
}

import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { SortDirection } from '@island.is/content-search-toolkit'
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'
import GraphQLJSON from 'graphql-type-json'

/**
 * We need to make sure that these two classes have the same fields,
 * one is used for input and the other one is used for output in order to do request-response matching
 */

@InputType()
export class GetPublishedMaterialInput {
  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  // The page number is 1-based meaning that page 1 is the first page
  page?: number

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  organizationSlug?: string

  @Field(() => String)
  @IsString()
  searchString = ''

  @Field(() => [String])
  tags!: string[]

  @Field(() => GraphQLJSON)
  tagGroups!: Record<string, string[]>

  @Field(() => GraphQLJSON)
  sort!: { field: 'title.sort' | 'releaseDate'; order: SortDirection }
}

@ObjectType()
export class GetPublishedMaterialObject {
  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  // The page number is 1-based meaning that page 1 is the first page
  page?: number

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  organizationSlug?: string

  @Field(() => String)
  @IsString()
  searchString = ''

  @Field(() => [String])
  tags!: string[]

  @Field(() => GraphQLJSON)
  tagGroups!: Record<string, string[]>

  @Field(() => GraphQLJSON)
  sort!: { field: 'title.sort' | 'releaseDate'; order: SortDirection }
}

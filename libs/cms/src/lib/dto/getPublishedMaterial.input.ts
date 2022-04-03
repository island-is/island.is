import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'
import GraphQLJSON from 'graphql-type-json'

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
}

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'
import GraphQLJSON from 'graphql-type-json'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
@ObjectType('GenericListItemResponseInput')
export class GetGenericListItemsInput {
  @Field(() => String)
  @IsString()
  genericListId!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  page?: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  queryString?: string

  @Field(() => [String], { nullable: true })
  tags?: string[]

  @Field(() => GraphQLJSON, { nullable: true })
  tagGroups?: Record<string, string[]>
}

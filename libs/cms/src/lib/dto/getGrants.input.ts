import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'
import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { GrantStatus } from '../models/grant.model'
import { CacheField } from '@island.is/nest/graphql'
import { SortField } from '@island.is/content-search-toolkit'

export enum GrantsSortBy {
  ALPHABETICAL,
  RECENTLY_UPDATED,
}

registerEnumType(GrantsSortBy, {
  name: 'GetGrantsInputSortByEnum',
})

@InputType()
export class GetGrantsInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  page?: number = 1

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number = 8

  @CacheField(() => GrantsSortBy, { nullable: true })
  @IsOptional()
  sort?: GrantsSortBy

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  statuses?: string[]

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  categories?: string[]

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  types?: string[]

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  organizations?: string[]

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  funds?: string[]
}

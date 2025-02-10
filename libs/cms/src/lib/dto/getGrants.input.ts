import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'
import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CacheField } from '@island.is/nest/graphql'

export enum GrantsSortBy {
  ALPHABETICAL,
  RECENTLY_UPDATED,
}

registerEnumType(GrantsSortBy, {
  name: 'GetGrantsInputSortByEnum',
})

export enum GrantsAvailabilityStatus {
  OPEN,
  CLOSED,
}

registerEnumType(GrantsAvailabilityStatus, {
  name: 'GetGrantsInputAvailabilityStatusEnum',
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

  @CacheField(() => GrantsAvailabilityStatus, { nullable: true })
  @IsOptional()
  status?: GrantsAvailabilityStatus

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

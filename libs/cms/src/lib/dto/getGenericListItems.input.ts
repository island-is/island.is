import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { SortDirection, SortField } from '@island.is/content-search-toolkit'
import { CacheField } from '@island.is/nest/graphql'
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
@ObjectType('GetGenericListItemsSortFieldInput')
class GetGenericListItemsInputSortField {
  @CacheField(() => SortField)
  field!: SortField

  @CacheField(() => SortDirection)
  order!: SortDirection
}

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

  @CacheField(() => GetGenericListItemsInputSortField, { nullable: true })
  @IsOptional()
  sort?: GetGenericListItemsInputSortField
}

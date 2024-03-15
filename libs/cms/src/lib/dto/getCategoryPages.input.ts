import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { SortField } from '@island.is/content-search-toolkit'
import { CacheField } from '@island.is/nest/graphql'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator'

@InputType()
export class GetCategoryPagesInput {
  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  category?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  group?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  subgroup?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  organization?: string

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  size?: number = 100

  @CacheField(() => SortField, { nullable: true })
  @IsOptional()
  sort?: SortField = SortField.TITLE
}

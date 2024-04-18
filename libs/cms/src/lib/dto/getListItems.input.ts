import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
@ObjectType('ListItemResponseInput')
export class GetListItemsInput {
  @Field(() => String)
  @IsString()
  listPageId!: string

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
}

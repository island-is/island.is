import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'
import { Field, InputType, Int } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

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

  @Field({ nullable: true })
  @IsArray()
  @IsOptional()
  statuses?: string[]

  @Field({ nullable: true })
  @IsArray()
  @IsOptional()
  categories?: string[]

  @Field({ nullable: true })
  @IsArray()
  @IsOptional()
  types?: string[]

  @Field({ nullable: true })
  @IsArray()
  @IsOptional()
  organizations?: string[]
}

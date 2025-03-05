import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetEventsInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  lang: ElasticsearchIndexLocale = 'is'

  @Field({ nullable: true })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc'

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  page?: number = 1

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number = 10

  @Field(() => String, { nullable: true })
  @IsOptional()
  organization?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  onlyIncludePastEvents?: boolean
}

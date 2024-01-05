import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetNewsDatesInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  lang: ElasticsearchIndexLocale = 'is'

  @Field({ nullable: true })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc'

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tags?: string[]

  @Field(() => String, { nullable: true })
  @IsOptional()
  organization?: string
}

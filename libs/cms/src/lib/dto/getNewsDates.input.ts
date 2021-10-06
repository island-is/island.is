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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  tag?: string
}

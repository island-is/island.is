import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetServiceWebPageInput {
  @Field()
  @IsString()
  slug!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'
}

import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetListItemsInput {
  @Field()
  @IsString()
  listPageId!: string

  @Field()
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  // TODO: look into cursor based pagination
}

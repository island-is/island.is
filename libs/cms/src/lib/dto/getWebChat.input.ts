import { Field, InputType } from '@nestjs/graphql'
import type { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetWebChatInput {
  @Field(() => String)
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => [String])
  displayLocationIds!: string[]
}

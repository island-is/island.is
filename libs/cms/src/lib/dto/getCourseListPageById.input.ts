import type { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetCourseListPageByIdInput {
  @Field(() => String)
  id!: string

  @Field(() => String)
  lang: ElasticsearchIndexLocale = 'is'
}

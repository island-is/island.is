import type { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
@ObjectType('GetCourseByIdInputModel')
export class GetCourseByIdInput {
  @Field(() => String)
  id!: string

  @Field(() => String)
  lang: ElasticsearchIndexLocale = 'is'
}

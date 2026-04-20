import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
@ObjectType('GetCourseSelectOptionsInputModel')
export class GetCourseSelectOptionsInput {
  @Field(() => String)
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => String, { nullable: true })
  organizationId?: string
}

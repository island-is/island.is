import type { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@InputType()
@ObjectType('GetCoursesInputModel')
export class GetCoursesInput {
  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => [String], { nullable: true })
  categoryKeys?: string[]

  @Field(() => String)
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => String, { nullable: true })
  organizationSlug?: string
}

@InputType()
export class GetCourseCategoriesInput {
  @Field(() => String)
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => String, { nullable: true })
  organizationSlug?: string
}

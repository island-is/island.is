import type { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@InputType()
@ObjectType('GetBloodDonationRestrictionsInputModel')
export class GetBloodDonationRestrictionsInput {
  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => String, { nullable: true })
  queryString?: string

  @Field(() => [String], { nullable: true })
  tagKeys?: string[]

  @Field(() => String)
  lang: ElasticsearchIndexLocale = 'is'
}

@InputType()
export class GetBloodDonationRestrictionDetailsInput {
  @Field(() => String)
  id!: string

  @Field(() => String)
  lang = 'is-IS'
}

@InputType()
export class GetBloodDonationRestrictionGenericTagsInput {
  @Field(() => String)
  lang: ElasticsearchIndexLocale = 'is'
}

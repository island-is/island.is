import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetOrganizationParentSubpageInput {
  @Field()
  @IsString()
  slug!: string

  @Field()
  @IsString()
  organizationPageSlug!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'
}

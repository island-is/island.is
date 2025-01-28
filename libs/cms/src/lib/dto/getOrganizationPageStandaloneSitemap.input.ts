import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetOrganizationPageStandaloneSitemapLevel1Input {
  @Field()
  @IsString()
  organizationPageSlug!: string

  @Field()
  @IsString()
  categorySlug!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'
}

@InputType()
export class GetOrganizationPageStandaloneSitemapLevel2Input extends GetOrganizationPageStandaloneSitemapLevel1Input {
  @Field()
  @IsString()
  subcategorySlug!: string
}

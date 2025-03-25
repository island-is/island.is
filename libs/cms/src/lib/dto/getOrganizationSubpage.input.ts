import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetOrganizationSubpageInput {
  @Field()
  @IsString()
  organizationSlug!: string

  @Field()
  @IsString()
  slug!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'
}

@InputType()
export class GetOrganizationSubpageByIdInput {
  @Field()
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'
}

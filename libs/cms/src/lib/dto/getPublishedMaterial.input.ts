import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetPublishedMaterialInput {
  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  organizationSlug?: string
}

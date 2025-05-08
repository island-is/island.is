import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetCustomSubpageInput {
  @Field(() => String)
  parentPageId!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => String)
  slug!: string
}

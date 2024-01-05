import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetSingleManualInput {
  @Field()
  @IsString()
  slug!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'
}

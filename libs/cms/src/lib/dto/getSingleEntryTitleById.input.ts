import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetSingleEntryTitleByIdInput {
  @Field()
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'
}

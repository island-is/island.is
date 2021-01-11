import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class SyncInput {
  @Field(() => String)
  @IsString()
  locale: ElasticsearchIndexLocale

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  token: string
}

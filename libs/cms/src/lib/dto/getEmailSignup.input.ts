import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetEmailSignupInput {
  @Field()
  @IsString()
  id!: string

  @Field(() => String)
  @IsOptional()
  @IsString()
  lang?: ElasticsearchIndexLocale = 'is'
}

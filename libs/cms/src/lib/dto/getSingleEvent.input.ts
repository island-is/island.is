import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetSingleEventInput {
  @Field()
  @IsString()
  slug!: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  lang: ElasticsearchIndexLocale = 'is'
}

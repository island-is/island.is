import { IsOptional, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetGrantsInput {
  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  category?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  type?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  organization?: string
}

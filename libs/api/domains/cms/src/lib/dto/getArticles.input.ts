import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetArticlesInput {
  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale

  @Field()
  @IsString()
  category: string

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  size?: number = 100
}

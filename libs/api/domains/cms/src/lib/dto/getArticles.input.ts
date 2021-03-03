import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetArticlesInput {
  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  category?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  organization?: string

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  size?: number = 100

  @Field({ nullable: true })
  @IsEnum(['title', 'popular'])
  @IsOptional()
  sort?: 'title' | 'popular' = 'title'
}

import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetFeaturedSupportQNAsInput {
  @Field()
  @IsString()
  organization!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  size?: number = 10
}

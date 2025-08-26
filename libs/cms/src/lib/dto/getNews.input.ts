import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@InputType()
export class GetNewsInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  year?: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  month?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

  @Field({ nullable: true })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc'

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  page?: number = 1

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number = 10

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tags?: string[]

  @Field(() => String, { nullable: true })
  @IsOptional()
  organization?: string
}

@InputType()
export class GetCmsNewsInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  lang: ElasticsearchIndexLocale = 'is'

  @Field({ nullable: true })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc'

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  page?: number = 1

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number = 10

  @Field(() => String, { nullable: true })
  @IsOptional()
  organization?: string
}

import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

@InputType()
export class GetArticlesInput {
  @Field()
  @IsString()
  lang: string

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

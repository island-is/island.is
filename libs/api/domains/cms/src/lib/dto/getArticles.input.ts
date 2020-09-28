import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'

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
  @IsOptional()
  size?: number
}

import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetNewsInput {
  @Field()
  @IsString()
  lang: string

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number = 10
}

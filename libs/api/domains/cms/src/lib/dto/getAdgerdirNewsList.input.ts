import { Field, InputType, Int } from '@nestjs/graphql'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetAdgerdirNewsListInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  year?: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  month?: number

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  ascending?: boolean

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  page?: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  perPage?: number
}

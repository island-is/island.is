import { Field, InputType, Int } from '@nestjs/graphql'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetNewsListInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string

  @Field((type) => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  year?: number

  @Field((type) => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  month?: number

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  ascending?: boolean

  @Field((type) => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  page?: number

  @Field((type) => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  perPage?: number
}

import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetAdgerdirPagesInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  perPage?: number
}

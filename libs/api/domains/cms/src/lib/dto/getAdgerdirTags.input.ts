import { Field, InputType, Int } from '@nestjs/graphql'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetAdgerdirTagsInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string
}

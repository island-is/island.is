import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetAdgerdirTagsInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string
}

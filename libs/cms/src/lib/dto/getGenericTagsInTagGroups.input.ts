import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetGenericTagsInTagGroupsInput {
  @Field(() => String)
  @IsString()
  lang = 'is-IS'

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  tagGroupSlugs?: Array<string>
}

import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetGenericTagInTagGroupInput {
  @Field(() => String)
  @IsString()
  lang = 'is-IS'

  @Field()
  @IsString()
  @IsOptional()
  tagGroupSlug?: string
}

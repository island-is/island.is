import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetHomepageInput {
  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}

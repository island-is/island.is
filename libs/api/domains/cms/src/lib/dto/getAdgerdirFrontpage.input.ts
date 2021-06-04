import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetAdgerdirFrontpageInput {
  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}

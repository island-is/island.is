import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetOrganizationByTitleInput {
  @Field(() => String)
  @IsString()
  title?: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}

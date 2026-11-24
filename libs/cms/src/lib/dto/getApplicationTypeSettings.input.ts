import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetApplicationTypeSettingsInput {
  @Field()
  @IsString()
  applicationType!: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}

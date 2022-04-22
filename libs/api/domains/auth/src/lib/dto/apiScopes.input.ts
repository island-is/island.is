import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('AuthApiScopesInput')
export class ApiScopesInput {
  @Field(() => String)
  @IsString()
  lang = 'is'
}

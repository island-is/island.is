import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthApiScopesInput')
export class ApiScopesInput {
  @Field(() => String)
  lang = 'is'
}

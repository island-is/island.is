import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthApiScopeInput')
export class ApiScopeInput {
  @Field(() => String)
  lang = 'is'

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  domain?: string
}

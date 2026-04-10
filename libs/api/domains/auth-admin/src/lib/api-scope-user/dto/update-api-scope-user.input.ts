import { Field, InputType } from '@nestjs/graphql'

import { ApiScopeUserAccessInput } from './api-scope-user-access.input'

@InputType('UpdateAuthAdminApiScopeUserInput')
export class UpdateApiScopeUserInput {
  @Field(() => String)
  nationalId!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => [ApiScopeUserAccessInput], { nullable: true })
  userAccess?: ApiScopeUserAccessInput[]
}

import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { ApiScopeUserAccessInput } from './api-scope-user-access.input'

@InputType('CreateAuthAdminApiScopeUserInput')
export class CreateApiScopeUserInput {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => [ApiScopeUserAccessInput], { nullable: true })
  userAccess?: ApiScopeUserAccessInput[]

  @Field(() => [Environment], { nullable: true })
  environments?: Environment[]
}

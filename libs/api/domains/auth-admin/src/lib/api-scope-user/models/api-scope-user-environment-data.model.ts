import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { ApiScopeUserAccess } from './api-scope-user-access.model'

@ObjectType('AuthAdminApiScopeUserEnvironmentData')
export class ApiScopeUserEnvironmentData {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => String)
  nationalId!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String)
  email!: string

  @Field(() => [ApiScopeUserAccess], { nullable: true })
  userAccess?: ApiScopeUserAccess[]
}

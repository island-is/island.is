import { Field, ObjectType } from '@nestjs/graphql'

import { ApiScopeUserAccess } from './api-scope-user-access.model'

@ObjectType('AuthAdminApiScopeUser')
export class ApiScopeUser {
  @Field(() => String)
  nationalId!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String)
  email!: string

  @Field(() => [ApiScopeUserAccess], { nullable: true })
  userAccess?: ApiScopeUserAccess[]
}

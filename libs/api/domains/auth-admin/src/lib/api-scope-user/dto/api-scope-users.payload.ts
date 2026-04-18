import { Field, Int, ObjectType } from '@nestjs/graphql'

import { ApiScopeUser } from '../models/api-scope-user.model'

@ObjectType('AuthAdminApiScopeUsersPayload')
export class ApiScopeUsersPayload {
  @Field(() => [ApiScopeUser])
  rows!: ApiScopeUser[]

  @Field(() => Int)
  totalCount!: number
}

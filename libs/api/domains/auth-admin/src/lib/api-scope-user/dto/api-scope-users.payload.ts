import { Field, Int, ObjectType } from '@nestjs/graphql'

import { ApiScopeUserListItem } from '../models/api-scope-user-list-item.model'

@ObjectType('AuthAdminApiScopeUsersPayload')
export class ApiScopeUsersPayload {
  @Field(() => [ApiScopeUserListItem])
  rows!: ApiScopeUserListItem[]

  @Field(() => Int)
  totalCount!: number
}

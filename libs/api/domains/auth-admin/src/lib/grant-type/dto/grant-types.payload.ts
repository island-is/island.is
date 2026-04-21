import { Field, Int, ObjectType } from '@nestjs/graphql'

import { GrantTypeListItem } from '../models/grant-type-list-item.model'

@ObjectType('AuthAdminGrantTypesPayload')
export class GrantTypesPayload {
  @Field(() => [GrantTypeListItem])
  rows!: GrantTypeListItem[]

  @Field(() => Int)
  totalCount!: number
}

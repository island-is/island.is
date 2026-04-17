import { Field, Int, ObjectType } from '@nestjs/graphql'

import { GrantType } from '../models/grant-type.model'

@ObjectType('AuthAdminGrantTypesPayload')
export class GrantTypesPayload {
  @Field(() => [GrantType])
  rows!: GrantType[]

  @Field(() => Int)
  totalCount!: number
}

import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('UpdateAuthAdminScopeClientsInput')
export class UpdateScopeClientsInput {
  @Field(() => String)
  tenantId!: string

  @Field(() => String)
  scopeName!: string

  @Field(() => [String])
  addedClientIds!: string[]

  @Field(() => [String])
  removedClientIds!: string[]

  @Field(() => [Environment])
  environments!: Environment[]
}

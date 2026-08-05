import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('UpdateAuthAdminScopeUsersInput')
export class UpdateScopeUsersInput {
  @Field(() => String)
  tenantId!: string

  @Field(() => String)
  scopeName!: string

  @Field(() => [String])
  addedNationalIds!: string[]

  @Field(() => [String])
  removedNationalIds!: string[]

  @Field(() => [Environment])
  environments!: Environment[]
}

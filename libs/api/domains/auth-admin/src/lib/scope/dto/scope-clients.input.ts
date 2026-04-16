import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType()
export class ScopeClientsInput {
  @Field(() => String)
  tenantId!: string

  @Field(() => String)
  scopeName!: string

  @Field(() => Environment)
  environment!: Environment
}

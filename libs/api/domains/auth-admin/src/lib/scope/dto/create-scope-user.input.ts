import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('CreateAuthAdminScopeUserInput')
export class CreateScopeUserInput {
  @Field(() => String)
  tenantId!: string

  @Field(() => String)
  scopeName!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => [Environment])
  environments!: Environment[]
}

import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('AuthAdminGrantableClientsInput')
export class GrantableClientsInput {
  @Field(() => Environment)
  environment!: Environment
}

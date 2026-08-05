import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminEnvironmentFailure')
export class EnvironmentFailure {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => String)
  message!: string
}

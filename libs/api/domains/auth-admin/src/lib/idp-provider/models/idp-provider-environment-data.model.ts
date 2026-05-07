import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminIdpProviderEnvironmentData')
export class IdpProviderEnvironmentData {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => String)
  name!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  helptext!: string

  @Field(() => Int)
  level!: number
}

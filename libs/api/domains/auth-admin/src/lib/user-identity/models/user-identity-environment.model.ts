import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { UserIdentityClaim } from './user-identity-claim.model'

@ObjectType('AuthAdminUserIdentityEnvironment')
export class UserIdentityEnvironment {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => Boolean)
  active!: boolean

  @Field(() => [UserIdentityClaim])
  claims!: UserIdentityClaim[]
}

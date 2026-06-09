import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { UserIdentityClaim } from './user-identity-claim.model'
import { UserIdentityEnvironment } from './user-identity-environment.model'

@ObjectType('AuthAdminUserIdentity')
export class UserIdentity {
  @Field(() => String)
  subjectId!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  providerName!: string

  @Field(() => String)
  providerSubjectId!: string

  @Field(() => [Environment])
  availableEnvironments!: Environment[]

  @Field(() => [Environment])
  activeEnvironments!: Environment[]

  @Field(() => [Environment])
  deactivatedEnvironments!: Environment[]

  @Field(() => [UserIdentityClaim])
  claims!: UserIdentityClaim[]

  @Field(() => [UserIdentityEnvironment])
  environments!: UserIdentityEnvironment[]
}

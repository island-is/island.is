import { Field, ID, ObjectType } from '@nestjs/graphql'
import { DelegationType } from './DelegationType.dto'
import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminDelegationProvider')
export class DelegationProvider {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  description!: string

  @Field(() => [DelegationType])
  delegationTypes!: DelegationType[]
}

@ObjectType('AuthDelegationProviderEnvironment')
export class DelegationProviderEnvironment {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => [DelegationProvider])
  providers!: DelegationProvider[]
}

@ObjectType('AuthDelegationProviderPayload')
export class DelegationProviderPayload {
  @Field(() => [DelegationProviderEnvironment])
  environments!: DelegationProviderEnvironment[]
}

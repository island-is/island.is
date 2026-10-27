import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Identity } from '@island.is/api/domains/identity'
import { AuthDelegationType } from '@island.is/clients/auth/delegation-api'
// Registers the AuthDelegationType GraphQL enum.
import '@island.is/api/domains/auth'

@ObjectType('DelegationOverviewScope')
export class DelegationOverviewScopeModel {
  @Field(() => String)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => Date, { nullable: true })
  validFrom?: Date | null

  @Field(() => Date, { nullable: true })
  validTo?: Date | null
}

@ObjectType('DelegationOverviewDelegation')
export class DelegationOverviewDelegationModel {
  @Field(() => ID)
  id!: string

  @Field(() => AuthDelegationType)
  type!: AuthDelegationType

  @Field(() => Identity)
  from!: Identity

  @Field(() => Identity)
  to!: Identity

  @Field(() => Date, { nullable: true })
  validTo?: Date | null

  @Field(() => Boolean)
  isActive!: boolean

  @Field(() => Date, { nullable: true })
  indexedAt?: Date | null

  @Field(() => [DelegationOverviewScopeModel])
  scopes!: DelegationOverviewScopeModel[]

  @Field(() => [String])
  clientIds!: string[]
}

@ObjectType('DelegationOverviewClient')
export class DelegationOverviewClientModel {
  @Field(() => String)
  clientId!: string

  @Field(() => String, { nullable: true })
  clientName?: string | null

  @Field(() => String)
  domainName!: string
}

@ObjectType('DelegationOverview')
export class DelegationOverviewModel {
  @Field(() => String)
  nationalId!: string

  @Field(() => String, {
    nullable: true,
    description:
      'Only set when the person has delegations on the organization clients.',
  })
  name?: string | null

  @Field(() => [DelegationOverviewClientModel])
  clients!: DelegationOverviewClientModel[]

  @Field(() => [DelegationOverviewDelegationModel])
  incoming!: DelegationOverviewDelegationModel[]

  @Field(() => [DelegationOverviewDelegationModel])
  outgoing!: DelegationOverviewDelegationModel[]
}

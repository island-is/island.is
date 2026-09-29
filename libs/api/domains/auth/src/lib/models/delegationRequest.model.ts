import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { Identity } from '@island.is/api/domains/identity'
import { DelegationRequestStatus } from '@island.is/clients/auth/delegation-api'

registerEnumType(DelegationRequestStatus, {
  name: 'AuthDelegationRequestStatus',
})

@ObjectType('AuthDelegationRequestScope')
export class DelegationRequestScope {
  @Field(() => String)
  scopeName!: string

  @Field(() => String, { nullable: true })
  displayName?: string | null

  @Field(() => String, { nullable: true })
  domainName?: string | null

  @Field(() => String, { nullable: true })
  domainDisplayName?: string | null

  /** Organisation logo, resolved from the domain's national id. */
  @Field(() => String, { nullable: true })
  organisationLogoUrl?: string | null

  // Internal — used by the organisationLogoUrl field resolver.
  domainNationalId?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => Boolean, { nullable: true })
  allowsWrite?: boolean | null

  @Field(() => Date, { nullable: true })
  validTo?: Date | null
}

@ObjectType('AuthDelegationRequest')
export class DelegationRequest {
  @Field(() => ID)
  id!: string

  /** The prospective grantor (individual or company). */
  @Field(() => Identity)
  from!: Identity

  /** The requester / prospective delegate. */
  @Field(() => Identity)
  to!: Identity

  @Field(() => String, { nullable: true })
  domainName?: string | null

  @Field(() => String)
  relationship!: string

  @Field(() => String)
  reason!: string

  @Field(() => DelegationRequestStatus)
  status!: DelegationRequestStatus

  @Field(() => [DelegationRequestScope])
  scopes!: DelegationRequestScope[]

  @Field(() => Date)
  expiresAt!: Date

  @Field(() => Date, { nullable: true })
  createdAt?: Date | null

  /** Id of the delegation created when the request was approved. */
  @Field(() => String, { nullable: true })
  resolvedDelegationId?: string | null

  // Internal attributes used by field resolvers.
  fromNationalId!: string
  toNationalId!: string
}

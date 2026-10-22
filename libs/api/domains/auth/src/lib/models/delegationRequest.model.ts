import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { PendingDelegationConfirmation } from './delegationConfirmation.model'

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

  @Field(() => String, { nullable: true })
  organisationLogoUrl?: string | null

  domainNationalId?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => Boolean, { nullable: true })
  allowsWrite?: boolean | null

  @Field(() => Boolean)
  requiresConfirmation!: boolean

  @Field(() => Date, { nullable: true })
  validTo?: Date | null
}

@ObjectType('AuthDelegationRequest')
export class DelegationRequest {
  @Field(() => ID)
  id!: string

  @Field(() => Identity)
  from!: Identity

  @Field(() => Identity)
  to!: Identity

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

  @Field(() => String, { nullable: true })
  resolvedDelegationId?: string | null

  @Field(() => Boolean)
  awaitingConfirmation!: boolean

  @Field(() => [PendingDelegationConfirmation], {
    nullable: true,
    description:
      'The step-up the grantor must complete. Present only on the response to approving a request with sensitive scopes.',
  })
  pendingConfirmations?: PendingDelegationConfirmation[]

  fromNationalId!: string
  toNationalId!: string
}

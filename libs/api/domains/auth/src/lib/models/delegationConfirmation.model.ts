import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { DelegationConfirmationStepUpMethod } from '../dto/delegationConfirmation.input'

/** The step-up a save started, for the client to show while the grantor approves. */
@ObjectType('AuthDelegationConfirmationAuthenticationStart')
export class DelegationConfirmationAuthenticationStart {
  @Field(() => DelegationConfirmationStepUpMethod)
  method!: DelegationConfirmationStepUpMethod

  @Field(() => String, {
    nullable: true,
    description:
      'The code shown in the Auðkenni app. Show it so the grantor can check they match.',
  })
  verificationCode?: string | null

  @Field(() => Int, { description: 'Seconds to wait between polls.' })
  interval!: number

  @Field(() => Int, { description: 'Seconds until the step-up gives up.' })
  expiresIn!: number
}

/**
 * Tells the client that a grant was held because it needs a second,
 * high-assurance confirmation, and carries the step-up already on its way to
 * the grantor.
 */
@ObjectType('AuthPendingDelegationConfirmation')
export class PendingDelegationConfirmation {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  toNationalId!: string

  @Field(() => String, { nullable: true })
  domainName?: string | null

  @Field(() => Date, {
    description:
      'After this point the confirmation can no longer be completed.',
  })
  expiresAt!: Date

  @Field(() => [String])
  scopeNames!: string[]

  @Field(() => String, {
    nullable: true,
    description:
      'Shared by the confirmations one save made. One authentication confirms them all.',
  })
  groupId?: string | null

  @Field(() => DelegationConfirmationAuthenticationStart, {
    description:
      'The step-up the save started. The same for every confirmation of a group.',
  })
  authentication!: DelegationConfirmationAuthenticationStart
}

export enum DelegationConfirmationAuthenticationStatus {
  /** Waiting for the grantor to approve on their phone. Keep polling. */
  pending = 'pending',
  /** Done: the held scopes are granted. */
  confirmed = 'confirmed',
  /** The grantor declined, or someone else answered. Save again to retry. */
  denied = 'denied',
  /** The step-up ran out of time. Save again to retry. */
  timed_out = 'timed_out',
  /** The confirmation is over. Save again to retry. */
  expired = 'expired',
}

registerEnumType(DelegationConfirmationAuthenticationStatus, {
  name: 'AuthDelegationConfirmationAuthenticationStatus',
})

@ObjectType('AuthDelegationConfirmationAuthentication')
export class DelegationConfirmationAuthentication {
  @Field(() => DelegationConfirmationAuthenticationStatus)
  status!: DelegationConfirmationAuthenticationStatus
}

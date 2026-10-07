import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { DelegationConfirmationStepUpMethod } from '../dto/delegationConfirmation.input'

/** A scope held pending a high-assurance confirmation. */
@ObjectType('AuthDelegationConfirmationScope')
export class DelegationConfirmationScope {
  @Field(() => String)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => Date)
  validTo!: Date
}

/**
 * Tells the client that some scopes of a grant were not applied because they
 * need a second, high-assurance confirmation, and carries what it needs to
 * complete one.
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

  @Field(() => String, {
    description:
      'Digest of the grant being confirmed. Echoed back when completing the confirmation.',
  })
  contentHash!: string

  @Field(() => String, {
    description:
      'The assurance level the confirming authentication must assert, e.g. eidas-loa-high.',
  })
  requestedAcr!: string

  @Field(() => [String])
  scopeNames!: string[]
}

/** A confirmation as shown on the confirmation screen. */
@ObjectType('AuthDelegationConfirmation')
export class DelegationConfirmation {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  status!: string

  @Field(() => String)
  toNationalId!: string

  @Field(() => String)
  toName!: string

  @Field(() => String, { nullable: true })
  domainName?: string | null

  @Field(() => String, { nullable: true })
  domainDisplayName?: string | null

  @Field(() => [DelegationConfirmationScope])
  scopes!: DelegationConfirmationScope[]

  @Field(() => String)
  contentHash!: string

  @Field(() => String)
  requestedAcr!: string

  @Field(() => Date)
  expiresAt!: Date

  @Field(() => Date, { nullable: true })
  confirmedAt?: Date | null

  @Field(() => String, {
    description: 'The text shown in the Auðkenni app when confirming.',
  })
  bindingMessage!: string
}

/** The grantor's own copy of the evidence record. */
@ObjectType('AuthDelegationConfirmationReceipt')
export class DelegationConfirmationReceipt {
  @Field(() => String)
  receiptIssuer!: string

  @Field(() => String)
  confirmationId!: string

  @Field(() => String)
  toNationalId!: string

  @Field(() => String)
  toName!: string

  @Field(() => String, { nullable: true })
  domainDisplayName?: string | null

  @Field(() => [DelegationConfirmationScope])
  scopes!: DelegationConfirmationScope[]

  @Field(() => Date)
  confirmedAt!: Date

  @Field(() => String, {
    nullable: true,
    description: 'How the grantor authenticated when confirming.',
  })
  acr?: string | null

  @Field(() => Date, { nullable: true })
  authTime?: Date | null

  @Field(() => String)
  contentHash!: string

  @Field(() => String, {
    nullable: true,
    description:
      'SHA-256 fingerprint of the citizen certificate behind the authentication.',
  })
  certificateThumbprint?: string | null
}

export enum DelegationConfirmationAuthenticationStatus {
  /** No step-up in progress: start one. */
  not_started = 'not_started',
  /** Waiting for the grantor to approve on their phone. Keep polling. */
  pending = 'pending',
  /** Done: the held scopes are granted. */
  confirmed = 'confirmed',
  /** The grantor declined, or someone else answered. Can be started again. */
  denied = 'denied',
  /** The step-up ran out of time. Can be started again. */
  timed_out = 'timed_out',
  /** The confirmation itself expired or was superseded. Grant again. */
  expired = 'expired',
}

registerEnumType(DelegationConfirmationAuthenticationStatus, {
  name: 'AuthDelegationConfirmationAuthenticationStatus',
})

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

@ObjectType('AuthDelegationConfirmationAuthentication')
export class DelegationConfirmationAuthentication {
  @Field(() => DelegationConfirmationAuthenticationStatus)
  status!: DelegationConfirmationAuthenticationStatus

  @Field(() => DelegationConfirmation)
  confirmation!: DelegationConfirmation
}

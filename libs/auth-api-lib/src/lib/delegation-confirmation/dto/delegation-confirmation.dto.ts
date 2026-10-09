import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { DelegationConfirmation } from '../models/delegation-confirmation.model'
import type { ConfirmationScope } from '../types/delegation-confirmation-content'
import { DelegationConfirmationStatus } from '../types/delegation-confirmation-status'

const stepUpMethods = ['app', 'sim'] as const
const authenticationStatuses = [
  'not_started',
  'pending',
  'confirmed',
  'denied',
  'timed_out',
  'expired',
] as const

export class StartedDelegationConfirmationAuthenticationDTO {
  @ApiProperty({ enum: stepUpMethods })
  method!: typeof stepUpMethods[number]

  @ApiPropertyOptional({
    description:
      'The code shown in the Auðkenni app. Show it beside the request so the grantor can check they match.',
  })
  verificationCode?: string

  @ApiProperty({ description: 'Seconds to wait between polls.' })
  interval!: number

  @ApiProperty({ description: 'Seconds until the step-up gives up.' })
  expiresIn!: number
}

/**
 * Returned alongside a created or patched delegation, telling the client that
 * some scopes are held and how to complete them.
 */
export class PendingConfirmationDTO {
  constructor(model: DelegationConfirmation) {
    this.id = model.id
    this.toNationalId = model.toNationalId
    this.domainName = model.domainName ?? null
    this.expiresAt = model.expiresAt
    this.contentHash = model.contentHash
    this.requestedAcr = model.requestedAcr
    this.scopeNames = model.scopes.map((scope) => scope.name)
    this.groupId = model.groupId ?? null
  }

  @ApiProperty({
    description:
      'Identifier of the confirmation. Used to complete it after a fresh authentication.',
  })
  id: string

  @ApiProperty()
  toNationalId: string

  @ApiProperty({ nullable: true, type: String })
  domainName: string | null

  @ApiProperty({
    description:
      'After this point the confirmation can no longer be completed.',
  })
  expiresAt: Date

  @ApiProperty({
    description:
      'Digest of the grant being confirmed. The client echoes this back when completing the confirmation.',
  })
  contentHash: string

  @ApiProperty({
    description:
      'The authentication context class reference the confirming authentication must assert.',
  })
  requestedAcr: string

  @ApiProperty({ isArray: true, type: String })
  scopeNames: string[]

  @ApiProperty({
    nullable: true,
    type: String,
    description:
      'Shared by the confirmations one grant made. One authentication, started for any of them, confirms them all.',
  })
  groupId: string | null
}

/** One confirmation of a group, as shown on the confirmation screen. */
export class DelegationConfirmationGroupMemberDTO {
  constructor(model: DelegationConfirmation) {
    this.id = model.id
    this.status = model.status
    this.toNationalId = model.toNationalId
    this.toName = model.contentSnapshot.toName
    this.domainDisplayName = model.contentSnapshot.domainDisplayName ?? null
    this.scopes = model.scopes
  }

  @ApiProperty()
  id: string

  @ApiProperty({ enum: DelegationConfirmationStatus })
  status: DelegationConfirmationStatus

  @ApiProperty()
  toNationalId: string

  @ApiProperty()
  toName: string

  @ApiProperty({ nullable: true, type: String })
  domainDisplayName: string | null

  @ApiProperty({ isArray: true, type: Object })
  scopes: ConfirmationScope[]
}

/** The confirmation as shown on the confirmation screen. */
export class DelegationConfirmationDTO {
  constructor(model: DelegationConfirmation, group?: DelegationConfirmation[]) {
    this.id = model.id
    this.status = model.status
    this.fromNationalId = model.fromNationalId
    this.toNationalId = model.toNationalId
    this.toName = model.contentSnapshot.toName
    this.domainName = model.domainName ?? null
    this.domainDisplayName = model.contentSnapshot.domainDisplayName ?? null
    this.scopes = model.scopes
    this.contentHash = model.contentHash
    this.requestedAcr = model.requestedAcr
    this.expiresAt = model.expiresAt
    this.confirmedAt = model.confirmedAt ?? undefined
    this.bindingMessage = model.contentSnapshot.bindingMessage
    this.groupId = model.groupId ?? null
    this.group = group?.map(
      (member) => new DelegationConfirmationGroupMemberDTO(member),
    )
  }

  @ApiProperty()
  id: string

  @ApiProperty({ enum: DelegationConfirmationStatus })
  status: DelegationConfirmationStatus

  @ApiProperty({
    nullable: true,
    type: String,
    description:
      'Shared by the confirmations one grant made; one authentication confirms them all.',
  })
  groupId: string | null

  @ApiPropertyOptional({
    type: [DelegationConfirmationGroupMemberDTO],
    description:
      'Every confirmation the same authentication confirms, this one included. Only on a single confirmation.',
  })
  group?: DelegationConfirmationGroupMemberDTO[]

  @ApiProperty()
  fromNationalId: string

  @ApiProperty()
  toNationalId: string

  @ApiProperty()
  toName: string

  @ApiProperty({ nullable: true, type: String })
  domainName: string | null

  @ApiProperty({ nullable: true, type: String })
  domainDisplayName: string | null

  @ApiProperty({ isArray: true, type: Object })
  scopes: ConfirmationScope[]

  @ApiProperty()
  contentHash: string

  @ApiProperty()
  requestedAcr: string

  @ApiProperty()
  expiresAt: Date

  @ApiPropertyOptional()
  confirmedAt?: Date

  @ApiProperty({ description: 'The text shown in the Auðkenni app.' })
  bindingMessage: string
}

/**
 * The citizen's copy of the evidence record: what was agreed, by whom, when,
 * and how they authenticated. Readable after the delegation itself is gone.
 */
export class DelegationConfirmationReceiptDTO {
  constructor(model: DelegationConfirmation) {
    this.receiptIssuer = model.receiptIssuer
    this.confirmationId = model.id
    this.fromNationalId = model.fromNationalId
    this.actorNationalId = model.actorNationalId ?? undefined
    this.toNationalId = model.toNationalId
    this.toName = model.contentSnapshot.toName
    this.domainName = model.domainName ?? null
    this.domainDisplayName = model.contentSnapshot.domainDisplayName ?? null
    this.scopes = model.scopes
    this.requestedAt = model.contentSnapshot.requestedAt
    this.confirmedAt = model.confirmedAt as Date
    this.acr = model.acr ?? undefined
    this.amr = model.amr ?? undefined
    this.authTime = model.authTime ?? undefined
    this.contentHash = model.contentHash
    this.contentHashAlg = model.contentHashAlg
    this.certificateThumbprint = model.certificateThumbprint ?? undefined
  }

  @ApiProperty()
  receiptIssuer: string

  @ApiProperty()
  confirmationId: string

  @ApiProperty()
  fromNationalId: string

  @ApiPropertyOptional()
  actorNationalId?: string

  @ApiProperty()
  toNationalId: string

  @ApiProperty()
  toName: string

  @ApiProperty({ nullable: true, type: String })
  domainName: string | null

  @ApiProperty({ nullable: true, type: String })
  domainDisplayName: string | null

  @ApiProperty({ isArray: true, type: Object })
  scopes: ConfirmationScope[]

  @ApiProperty()
  requestedAt: string

  @ApiProperty()
  confirmedAt: Date

  @ApiPropertyOptional()
  acr?: string

  @ApiPropertyOptional({ isArray: true, type: String })
  amr?: string[]

  @ApiPropertyOptional()
  authTime?: Date

  @ApiProperty()
  contentHash: string

  @ApiProperty()
  contentHashAlg: string

  @ApiPropertyOptional({
    description:
      'SHA-256 fingerprint of the citizen certificate behind the authentication.',
  })
  certificateThumbprint?: string
}

/** Where the confirming authentication stands. */
export class DelegationConfirmationAuthenticationDTO {
  constructor(
    status: typeof authenticationStatuses[number],
    model: DelegationConfirmation,
  ) {
    this.status = status
    this.confirmation = new DelegationConfirmationDTO(model)
  }

  @ApiProperty({
    enum: authenticationStatuses,
    description:
      'not_started: start one. pending: keep polling. confirmed: the scopes are granted. denied / timed_out: start again. expired: the confirmation itself is over; grant again.',
  })
  status: typeof authenticationStatuses[number]

  @ApiProperty({ type: () => DelegationConfirmationDTO })
  confirmation: DelegationConfirmationDTO
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { StartAuthenticationResult } from '../delegation-confirmation.service'
import type { DelegationConfirmation } from '../models/delegation-confirmation.model'

const stepUpMethods = ['app', 'sim'] as const
const authenticationStatuses = [
  'pending',
  'confirmed',
  'denied',
  'timed_out',
  'expired',
] as const

export class StartedDelegationConfirmationAuthenticationDTO {
  constructor(started: StartAuthenticationResult) {
    this.method = started.method
    this.verificationCode = started.verificationCode
    this.interval = started.interval
    this.expiresIn = started.expiresIn
  }

  @ApiProperty({ enum: stepUpMethods })
  method: typeof stepUpMethods[number]

  @ApiPropertyOptional({
    description:
      'The code shown in the Auðkenni app. Show it beside the request so the grantor can check they match.',
  })
  verificationCode?: string

  @ApiProperty({ description: 'Seconds to wait between polls.' })
  interval: number

  @ApiProperty({ description: 'Seconds until the step-up gives up.' })
  expiresIn: number
}

export class PendingConfirmationDTO {
  constructor(
    model: DelegationConfirmation,
    authentication: StartAuthenticationResult,
  ) {
    this.id = model.id
    this.toNationalId = model.toNationalId
    this.domainName = model.domainName ?? null
    this.expiresAt = model.expiresAt
    this.scopeNames = model.scopes.map((scope) => scope.name)
    this.groupId = model.groupId ?? null
    this.authentication = new StartedDelegationConfirmationAuthenticationDTO(
      authentication,
    )
  }

  @ApiProperty({
    description:
      'Identifier of the confirmation. Poll its authentication with it.',
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

  @ApiProperty({ isArray: true, type: String })
  scopeNames: string[]

  @ApiProperty({
    nullable: true,
    type: String,
    description:
      'Shared by the confirmations one save made. One authentication confirms them all.',
  })
  groupId: string | null

  @ApiProperty({
    type: () => StartedDelegationConfirmationAuthenticationDTO,
    description:
      'The step-up already on its way to the grantor. The same for every confirmation of a group.',
  })
  authentication: StartedDelegationConfirmationAuthenticationDTO
}

export class DelegationConfirmationAuthenticationDTO {
  constructor(status: typeof authenticationStatuses[number]) {
    this.status = status
  }

  @ApiProperty({
    enum: authenticationStatuses,
    description:
      'pending: keep polling. confirmed: the scopes are granted. denied / timed_out / expired: nothing was granted; save the grant again to try again.',
  })
  status: typeof authenticationStatuses[number]
}

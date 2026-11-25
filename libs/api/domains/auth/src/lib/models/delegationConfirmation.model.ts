import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { DelegationConfirmationStepUpMethod } from '../dto/delegationConfirmation.input'

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
  pending = 'pending',
  confirmed = 'confirmed',
  denied = 'denied',
  timed_out = 'timed_out',
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

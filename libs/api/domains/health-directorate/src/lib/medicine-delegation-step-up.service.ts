import { createHash } from 'crypto'
import { ForbiddenException, Inject, Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CibaClient,
  SessionCannotStepUpError,
  isCardSession,
  type CibaStartResult,
  type StepUpClaims,
} from '@island.is/auth/step-up'
import type { ConfigType } from '@island.is/nest/config'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

import { MedicineDelegationCreateOrDeleteInput } from './dto/medicineDelegation.input'
import { MedicineDelegationStepUpConfig } from './medicineDelegationStepUp.config'

export const MEDICINE_DELEGATION_CIBA_CLIENT = 'MedicineDelegationCibaClient'

const FAKE_LOGIN_ACR = '0'

/** Shown by Auðkenni. Names no one: for a SIM it travels by SMS. */
const BINDING_MESSAGE = 'Veita lyfjaumboð á Ísland.is'

export type MedicineDelegationStepUpOutcome =
  | 'pending'
  | 'confirmed'
  | 'denied'
  | 'expired'

/**
 * Granting a pharmacy delegation needs a fresh electronic ID authentication of
 * the person granting it. Nothing is kept between the start and the check: the
 * identity server hands out the result of a request once, and the authentication
 * is bound to the grant by its hash.
 */
@Injectable()
export class MedicineDelegationStepUpService {
  constructor(
    @Inject(MedicineDelegationStepUpConfig.KEY)
    private readonly config: ConfigType<typeof MedicineDelegationStepUpConfig>,
    @Inject(MEDICINE_DELEGATION_CIBA_CLIENT)
    private readonly cibaClient: CibaClient,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async isRequired(user: User): Promise<boolean> {
    if (!this.config.requiredForClients.includes(user.client)) {
      return false
    }
    return this.featureFlagService.getValue(
      Features.isHealthMedicineDelegationStepUpEnabled,
      false,
      user,
    )
  }

  start(
    user: User,
    input: MedicineDelegationCreateOrDeleteInput,
  ): Promise<CibaStartResult> {
    if (isCardSession(user)) {
      throw new SessionCannotStepUpError()
    }

    return this.cibaClient.start({
      userToken: user.authorization,
      bindingMessage: BINDING_MESSAGE,
      contextHash: hashGrant(user, input),
    })
  }

  /** Confirmed only when the authentication was made by this person, now, for this grant. */
  async check(
    user: User,
    authReqId: string,
    input: MedicineDelegationCreateOrDeleteInput,
  ): Promise<MedicineDelegationStepUpOutcome> {
    const result = await this.cibaClient.poll(authReqId)
    if (result.status !== 'authenticated') {
      return result.status
    }

    this.assertStepUp(user, input, result.claims)
    return 'confirmed'
  }

  private assertStepUp(
    user: User,
    input: MedicineDelegationCreateOrDeleteInput,
    claims: StepUpClaims,
  ): void {
    if (claims.nationalId !== grantor(user)) {
      throw new ForbiddenException(
        'The authentication was made by another person.',
      )
    }

    const acrSatisfied =
      claims.acr === this.config.requiredAcr ||
      (this.config.allowFakeLogin && claims.acr === FAKE_LOGIN_ACR)
    if (!acrSatisfied) {
      throw new ForbiddenException(
        `Insufficient authentication: ${this.config.requiredAcr} is required.`,
      )
    }

    if (claims.contextHash !== hashGrant(user, input)) {
      throw new ForbiddenException(
        'The authentication was not made for this delegation.',
      )
    }

    const ageInSeconds = (Date.now() - claims.authTime.getTime()) / 1000
    if (ageInSeconds > this.config.maxAgeInSeconds) {
      throw new ForbiddenException(
        'Insufficient authentication: the authentication is too old.',
      )
    }
  }
}

/** The person at the keyboard: the actor when acting for someone else. */
const grantor = (user: User): string =>
  user.actor?.nationalId ?? user.nationalId

/** Keys in a fixed order, so the same grant always gives the same hash. */
export const hashGrant = (
  user: User,
  input: MedicineDelegationCreateOrDeleteInput,
): string =>
  createHash('sha256')
    .update(
      JSON.stringify([
        'medicine-delegation-grant',
        grantor(user),
        user.nationalId,
        input.nationalId,
        input.from?.toISOString() ?? null,
        input.to?.toISOString() ?? null,
        input.lookup === true,
      ]),
      'utf8',
    )
    .digest('hex')

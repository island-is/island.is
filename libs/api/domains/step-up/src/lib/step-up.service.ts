import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { GraphQLError } from 'graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CibaClient,
  type StepUpMethod as CibaStepUpMethod,
  type StepUpClaims,
  type StepUpStatus,
} from '@island.is/auth/step-up'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { StepUpConfig } from './step-up.config'
import {
  STEP_UP_STORE,
  type PendingStepUp,
  type StepUpStore,
} from './step-up.store'

export const STEP_UP_CIBA_CLIENT = 'STEP_UP_CIBA_CLIENT'

export const StepUpErrorCode = {
  /** The person must unlock before this data is served. */
  Required: 'STEP_UP_REQUIRED',
  TooManyAttempts: 'STEP_UP_TOO_MANY_ATTEMPTS',
  NotAvailable: 'STEP_UP_NOT_AVAILABLE',
} as const

export interface StartedStepUp {
  stepUpId: string
  method: PendingStepUp['method']
  /** Every method the person could use, so they can be offered the other one. */
  availableMethods: PendingStepUp['method'][]
  verificationCode?: string
  interval: number
  expiresIn: number
}

export interface StepUpSessionState {
  unlocked: boolean
  /** The latest it locks again, however busy. Idle use locks it sooner. */
  expiresAt?: Date
  idleSeconds: number
}

/**
 * Unlocking sensitive screens in the app: the person approves in Auðkenni, and
 * for a while after that their session may read what the locked screens show.
 *
 * The app's own lock (PIN, FaceID) proves someone can open the phone. This
 * proves the owner is the one holding it, which a year-long token can't.
 *
 * State lives on the server so the app can't fake it: an unlock record per
 * session, kept alive by use (idleSeconds) and never beyond maxSeconds.
 */
@Injectable()
export class StepUpService {
  constructor(
    @Inject(STEP_UP_CIBA_CLIENT) private readonly ciba: CibaClient,
    @Inject(STEP_UP_STORE) private readonly store: StepUpStore,
    @Inject(StepUpConfig.KEY)
    private readonly config: ConfigType<typeof StepUpConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  /** Whether locked screens apply to this session at all. */
  appliesTo(user: User): boolean {
    return this.config.clients.includes(user.client)
  }

  /**
   * @param method The person asking for the other method (app or SIM). Without
   * it the identity server goes by how this session was logged in.
   */
  async start(user: User, method?: CibaStepUpMethod): Promise<StartedStepUp> {
    if (!this.appliesTo(user)) {
      throw new GraphQLError('Unlocking is not available for this client.', {
        extensions: { code: StepUpErrorCode.NotAvailable },
      })
    }

    const nationalId = personOf(user)
    const starts = await this.store.countStart(
      nationalId,
      this.config.maxStartsWindowSeconds,
    )
    if (starts > this.config.maxStarts) {
      throw new GraphQLError('Too many attempts to unlock. Try again later.', {
        extensions: { code: StepUpErrorCode.TooManyAttempts },
      })
    }

    // Recorded before the request goes out, so the authentication that comes
    // back can be required to be no older than this.
    const startedAt = Date.now()

    const started = await this.ciba.start({
      userToken: user.authorization,
      bindingMessage: this.config.bindingMessage,
      ...(method && { method }),
    })

    const stepUpId = randomUUID()
    await this.store.setPending(
      stepUpId,
      {
        authReqId: started.authReqId,
        sessionKey: sessionKeyOf(user),
        nationalId,
        method: started.method,
        startedAt,
      },
      started.expiresIn,
    )

    return {
      stepUpId,
      method: started.method,
      availableMethods: started.availableMethods,
      verificationCode: started.verificationCode,
      interval: started.interval,
      expiresIn: started.expiresIn,
    }
  }

  async status(user: User, stepUpId: string): Promise<StepUpStatus> {
    const pending = await this.store.getPending(stepUpId)

    // Unknown, finished, or someone else's: all look the same from outside.
    if (!pending || pending.sessionKey !== sessionKeyOf(user)) {
      return 'expired'
    }

    if (pending.confirmed) {
      return 'confirmed'
    }

    const result = await this.ciba.poll(pending.authReqId)

    switch (result.status) {
      case 'pending':
        return 'pending'
      case 'denied':
        await this.store.deletePending(stepUpId)
        return 'denied'
      case 'expired':
        await this.store.deletePending(stepUpId)
        return 'timed_out'
    }

    if (!this.isAcceptable(pending, result.claims)) {
      await this.store.deletePending(stepUpId)
      return 'denied'
    }

    const now = Date.now()
    await this.store.setUnlock(
      pending.sessionKey,
      { authTime: result.claims.authTime.getTime(), unlockedAt: now },
      this.config.idleSeconds,
    )
    // Kept briefly, so a repeated poll answers the same.
    await this.store.setPending(stepUpId, { ...pending, confirmed: true }, 60)

    return 'confirmed'
  }

  async session(user: User): Promise<StepUpSessionState> {
    const unlock = await this.store.getUnlock(sessionKeyOf(user))
    const expiresAt = unlock
      ? unlock.unlockedAt + this.config.maxSeconds * 1000
      : undefined

    return {
      unlocked: !!expiresAt && expiresAt > Date.now(),
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      idleSeconds: this.config.idleSeconds,
    }
  }

  /**
   * Whether the session is unlocked right now. Each yes keeps it unlocked for
   * another idleSeconds, up to the absolute limit — that is what makes the lock
   * an inactivity lock.
   */
  async useUnlock(user: User): Promise<boolean> {
    const sessionKey = sessionKeyOf(user)
    const unlock = await this.store.getUnlock(sessionKey)
    if (!unlock) {
      return false
    }

    const remainingSeconds = Math.floor(
      (unlock.unlockedAt + this.config.maxSeconds * 1000 - Date.now()) / 1000,
    )
    if (remainingSeconds <= 0) {
      await this.store.deleteUnlock(sessionKey)
      return false
    }

    await this.store.setUnlock(
      sessionKey,
      unlock,
      Math.min(this.config.idleSeconds, remainingSeconds),
    )
    return true
  }

  /** Locks the session again straight away, e.g. when the person asks to. */
  async lock(user: User): Promise<void> {
    await this.store.deleteUnlock(sessionKeyOf(user))
  }

  private isAcceptable(pending: PendingStepUp, claims: StepUpClaims): boolean {
    // The identity server only ever authenticates the person behind the token
    // we sent; checked again on the token, where it matters.
    if (claims.nationalId !== pending.nationalId) {
      this.logger.warn('Step-up approved by someone other than the person.')
      return false
    }

    if (
      claims.acr !== this.config.requiredAcr &&
      !this.config.allowAnyAcrInDev
    ) {
      this.logger.warn(`Step-up at too low an assurance level: ${claims.acr}`)
      return false
    }

    // auth_time has whole seconds; the start has milliseconds.
    if (
      claims.authTime.getTime() <
      Math.floor(pending.startedAt / 1000) * 1000
    ) {
      this.logger.warn(
        'Step-up answered with an authentication made before it.',
      )
      return false
    }

    return true
  }
}

/** The person who must approve: the actor when acting for someone. */
const personOf = (user: User) => user.actor?.nationalId ?? user.nationalId

/**
 * What an unlock belongs to: this client's session for this person. Switching
 * to act for someone else keeps the person, so the unlock stays; another app
 * install, or a new login, does not.
 */
export const sessionKeyOf = (user: User) =>
  [user.client, personOf(user), user.sid ?? '-'].join(':')

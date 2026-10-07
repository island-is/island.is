import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GraphQLError } from 'graphql'

import { getRequest } from '@island.is/auth-nest-tools'
import { Features, FeatureFlagService } from '@island.is/nest/feature-flags'

import { StepUpErrorCode, StepUpService } from './step-up.service'

const STEP_UP_REQUIRED_KEY = 'step-up-required'

/**
 * Locks what this resolver serves behind a recent unlock, when the flag is on.
 * The flag is the on/off switch for a whole area of the app, and is the same
 * flag the app reads to show its lock screen, so the two can't disagree.
 *
 * App sessions (StepUpConfig.clients) need a recent unlock with electronic ID.
 * Any other session — the web — must have been logged in with electronic ID
 * (eidas-loa-high); a passkey session is turned away.
 *
 * Runs after the user is known: apply it above @UseGuards(IdsUserGuard, …) on
 * a class, or on a method.
 */
export const StepUpRequired = (flag: Features) =>
  applyDecorators(
    SetMetadata(STEP_UP_REQUIRED_KEY, flag),
    UseGuards(StepUpGuard),
  )

@Injectable()
export class StepUpGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly featureFlagService: FeatureFlagService,
    private readonly stepUpService: StepUpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const flag = this.reflector.getAllAndOverride<Features | undefined>(
      STEP_UP_REQUIRED_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!flag) {
      return true
    }

    const user = getRequest(context).user
    if (!user) {
      // Never pass for want of a user: that would be a guard-ordering mistake.
      throw new UnauthorizedException()
    }

    if (!(await this.featureFlagService.getValue(flag, false, user))) {
      return true
    }

    // Anything else, the web above all: only a session logged in with
    // electronic ID. A session opened with a passkey (e.g. from the app) is
    // turned away and asked to log in again.
    if (!this.stepUpService.appliesTo(user)) {
      if (this.stepUpService.meetsRequiredAssurance(user)) {
        return true
      }
      throw new GraphQLError('Log in with electronic ID to see this.', {
        extensions: { code: StepUpErrorCode.HighAssuranceRequired },
      })
    }

    // The app's long-lived session: a recent unlock with electronic ID.
    if (await this.stepUpService.useUnlock(user)) {
      return true
    }

    // RFC 9470's idea, in GraphQL terms: the token is fine, but the person must
    // authenticate again before this is served.
    throw new GraphQLError('Unlock to see this.', {
      extensions: { code: StepUpErrorCode.Required },
    })
  }
}

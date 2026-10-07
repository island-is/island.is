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

interface StepUpRequiredOptions {
  /**
   * Lock app sessions only, and leave the web as it is. For data the web also
   * serves outside Mínar síður, e.g. to applications, where a session opened
   * with a passkey is normal.
   */
  appsOnly?: boolean
}

interface StepUpRequirement extends StepUpRequiredOptions {
  flag: Features
}

/**
 * Locks what this resolver serves behind a recent unlock, when step-up is
 * enabled in the environment (StepUpConfig.enabled) and the flag is on for the
 * user. The flag is the same one the app reads to show its lock screen; if it
 * can't be read here, the data is locked.
 *
 * App sessions (StepUpConfig.clients) need a recent unlock with electronic ID.
 * Any other session — the web — must have been logged in with electronic ID
 * (eidas-loa-high); a passkey session is turned away.
 *
 * Runs after the user is known: apply it above @UseGuards(IdsUserGuard, …) on
 * a class, or on a method.
 */
export const StepUpRequired = (
  flag: Features,
  options: StepUpRequiredOptions = {},
) => {
  const requirement: StepUpRequirement = { ...options, flag }
  return applyDecorators(
    SetMetadata(STEP_UP_REQUIRED_KEY, requirement),
    UseGuards(StepUpGuard),
  )
}

@Injectable()
export class StepUpGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly featureFlagService: FeatureFlagService,
    private readonly stepUpService: StepUpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<
      StepUpRequirement | undefined
    >(STEP_UP_REQUIRED_KEY, [context.getHandler(), context.getClass()])
    if (!requirement || !this.stepUpService.isEnabled()) {
      return true
    }

    const user = getRequest(context).user
    if (!user) {
      // Never pass for want of a user: that would be a guard-ordering mistake.
      throw new UnauthorizedException()
    }

    // Defaults to locked: ConfigCat answers with the default when it can't be
    // reached, and an outage must not open the data.
    if (
      !(await this.featureFlagService.getValue(requirement.flag, true, user))
    ) {
      return true
    }

    // Anything else, the web above all: only a session logged in with
    // electronic ID. A session opened with a passkey (e.g. from the app) is
    // turned away and asked to log in again.
    if (!this.stepUpService.appliesTo(user)) {
      if (
        requirement.appsOnly ||
        this.stepUpService.meetsRequiredAssurance(user)
      ) {
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

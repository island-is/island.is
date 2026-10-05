import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Audit } from '@island.is/nest/audit'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import { StepUpService } from './step-up.service'
import {
  StepUpMethod,
  StepUpSession,
  StepUpStart,
  StepUpStatus,
} from './step-up.model'

/**
 * Unlocking locked screens. Any signed-in session may ask; who has to approve
 * is decided by the identity server from the session's own token.
 */
@UseGuards(IdsUserGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/step-up' })
export class StepUpResolver {
  constructor(private readonly stepUpService: StepUpService) {}

  @Query(() => StepUpSession, { name: 'stepUpSession' })
  session(@CurrentUser() user: User): Promise<StepUpSession> {
    return this.stepUpService.session(user)
  }

  @Mutation(() => StepUpStart, { name: 'stepUpStart' })
  @Audit()
  async start(@CurrentUser() user: User): Promise<StepUpStart> {
    const started = await this.stepUpService.start(user)
    return { ...started, method: started.method as StepUpMethod }
  }

  @Mutation(() => StepUpStatus, { name: 'stepUpStatus' })
  async status(
    @CurrentUser() user: User,
    @Args('stepUpId', { type: () => ID }) stepUpId: string,
  ): Promise<StepUpStatus> {
    return (await this.stepUpService.status(user, stepUpId)) as StepUpStatus
  }

  @Mutation(() => Boolean, { name: 'stepUpLock' })
  @Audit()
  async lock(@CurrentUser() user: User): Promise<boolean> {
    await this.stepUpService.lock(user)
    return true
  }
}

import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { DelegationConfirmationAuthenticationDTO } from '@island.is/clients/auth/delegation-api'

import { DelegationConfirmationInput } from '../dto'
import { DelegationConfirmationAuthentication } from '../models/delegationConfirmation.model'
import { MeDelegationConfirmationsService } from '../services/meDelegationConfirmations.service'

/**
 * Following "tvöfalt samþykki": saving a grant with a sensitive scope holds it
 * and starts the grantor's step-up (see `pendingConfirmations` on the saved
 * delegation). This is where the client follows that step-up.
 */
@UseGuards(IdsUserGuard)
@Resolver()
export class DelegationConfirmationResolver {
  constructor(
    private meDelegationConfirmationsService: MeDelegationConfirmationsService,
  ) {}

  /**
   * A mutation, not a query, although it is polled: the call that finds the
   * grantor has approved is the one that grants the held scopes, and a query
   * could be answered from the client's cache.
   */
  @Mutation(() => DelegationConfirmationAuthentication, {
    name: 'authCheckDelegationConfirmationAuthentication',
    description:
      'Where the confirming authentication stands. Poll at the interval returned with the saved grant; the call that finds the grantor has approved grants the held scopes.',
  })
  checkAuthentication(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationConfirmationInput })
    input: DelegationConfirmationInput,
  ): Promise<DelegationConfirmationAuthenticationDTO> {
    return this.meDelegationConfirmationsService.getAuthentication(user, input)
  }
}

import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { DelegationConfirmationAuthenticationDTO } from '@island.is/clients/auth/delegation-api'

import { DelegationConfirmationInput } from '../dto'
import { DelegationConfirmationAuthentication } from '../models/delegationConfirmation.model'
import { MeDelegationConfirmationsService } from '../services/meDelegationConfirmations.service'

@UseGuards(IdsUserGuard)
@Resolver()
export class DelegationConfirmationResolver {
  constructor(
    private meDelegationConfirmationsService: MeDelegationConfirmationsService,
  ) {}

  /** A mutation although it is polled: it can grant the held scopes, and a query could be cached. */
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

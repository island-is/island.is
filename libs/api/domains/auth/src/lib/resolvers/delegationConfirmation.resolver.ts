import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type {
  DelegationConfirmationAuthenticationDTO,
  DelegationConfirmationDTO,
  DelegationConfirmationReceiptDTO,
  StartedDelegationConfirmationAuthenticationDTO,
} from '@island.is/clients/auth/delegation-api'

import { DelegationConfirmationInput } from '../dto'
import {
  DelegationConfirmation,
  DelegationConfirmationAuthentication,
  DelegationConfirmationAuthenticationStart,
  DelegationConfirmationReceipt,
} from '../models/delegationConfirmation.model'
import { MeDelegationConfirmationsService } from '../services/meDelegationConfirmations.service'

/**
 * Completing "tvöfalt samþykki" for a delegation whose sensitive scopes were
 * held pending a fresh, high-assurance authentication.
 */
@UseGuards(IdsUserGuard)
@Resolver(() => DelegationConfirmation)
export class DelegationConfirmationResolver {
  constructor(
    private meDelegationConfirmationsService: MeDelegationConfirmationsService,
  ) {}

  @Query(() => [DelegationConfirmation], {
    name: 'authDelegationConfirmations',
  })
  getConfirmations(
    @CurrentUser() user: User,
  ): Promise<DelegationConfirmationDTO[]> {
    return this.meDelegationConfirmationsService.getConfirmations(user)
  }

  @Query(() => DelegationConfirmation, {
    name: 'authDelegationConfirmation',
    nullable: true,
  })
  getConfirmation(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationConfirmationInput })
    input: DelegationConfirmationInput,
  ): Promise<DelegationConfirmationDTO | null> {
    return this.meDelegationConfirmationsService.getConfirmation(user, input)
  }

  @Query(() => DelegationConfirmationReceipt, {
    name: 'authDelegationConfirmationReceipt',
    nullable: true,
    description:
      "The grantor's own copy of the evidence record. Available once the confirmation is completed, and readable after the delegation itself is gone.",
  })
  getReceipt(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationConfirmationInput })
    input: DelegationConfirmationInput,
  ): Promise<DelegationConfirmationReceiptDTO | null> {
    return this.meDelegationConfirmationsService.getReceipt(user, input)
  }

  @Mutation(() => DelegationConfirmationAuthenticationStart, {
    name: 'authStartDelegationConfirmationAuthentication',
    description:
      'Asks Auðkenni to authenticate the grantor on their own phone — by the method they logged in to this session with — showing what they are confirming. Then poll authCheckDelegationConfirmationAuthentication.',
  })
  startAuthentication(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationConfirmationInput })
    input: DelegationConfirmationInput,
  ): Promise<StartedDelegationConfirmationAuthenticationDTO> {
    return this.meDelegationConfirmationsService.startAuthentication(
      user,
      input,
    )
  }

  /**
   * A mutation, not a query, although it is polled: the call that finds the
   * grantor has approved is the one that grants the held scopes, and a query
   * could be answered from the client's cache.
   */
  @Mutation(() => DelegationConfirmationAuthentication, {
    name: 'authCheckDelegationConfirmationAuthentication',
    description:
      'Where the confirming authentication stands. Poll at the interval returned when starting; the call that finds the grantor has approved grants the held scopes.',
  })
  checkAuthentication(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationConfirmationInput })
    input: DelegationConfirmationInput,
  ): Promise<DelegationConfirmationAuthenticationDTO> {
    return this.meDelegationConfirmationsService.getAuthentication(user, input)
  }
}

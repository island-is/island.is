import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { ApplicationCardsInput } from './dto/applicationCards.input'
import { ApplicationCard } from './applicationV2.model'
import { ApplicationV2Service } from './applicationV2.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationCard)
export class ApplicationV2Resolver {
  constructor(private readonly applicationV2Service: ApplicationV2Service) {}

  @Query(() => [ApplicationCard], {
    nullable: true,
    name: 'ApplicationCard',
  })
  async applicationCards(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input', { nullable: true }) input: ApplicationCardsInput,
  ): Promise<ApplicationCard[] | null> {
    return this.applicationV2Service.getApplicationCards(user, locale, input)
  }
}

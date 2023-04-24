import { UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { ConsentsPaginated } from '../dto/consentsPaginated.response'
import { ClientLoader } from '../loaders/client.loader'
import { Client } from '../models/client.model'
import { Consent } from '../models/consent.model'
import { ScopePermissions } from '../models/scopePermissions.model'
import { ConsentService } from '../services/consent.service'
import { ScopePermissionsService } from '../services/scopePermissions.service'

import type { User } from '@island.is/auth-nest-tools'
import type { ClientDataLoader } from '../loaders/client.loader'

@UseGuards(IdsUserGuard)
@Resolver(() => Consent)
export class ConsentResolver {
  constructor(
    private readonly consentService: ConsentService,
    private readonly scopeService: ScopePermissionsService,
  ) {}

  @Query(() => ConsentsPaginated, { name: 'consentsList' })
  getConsents(@CurrentUser() user: User): Promise<ConsentsPaginated> {
    return this.consentService.getConsent(user)
  }

  @ResolveField('client', () => Client)
  resolveClient(
    @Loader(ClientLoader) clientLoader: ClientDataLoader,
    @Parent() consent: Consent,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ) {
    return clientLoader.load({ lang, clientId: consent.clientId })
  }

  @ResolveField('permissions', () => [ScopePermissions])
  resolveScopePermissions(
    @CurrentUser() user: User,
    @Parent() consent: Consent,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ): Promise<ScopePermissions[]> {
    return this.scopeService.getPermissions(
      user,
      lang,
      consent.consentedScopes,
      consent.rejectedScopes,
    )
  }
}

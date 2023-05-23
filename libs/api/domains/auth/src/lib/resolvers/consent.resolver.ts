import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { ConsentsPaginated } from '../dto/consentsPaginated.response'
import { PatchConsentInput } from '../dto/patchConsent.input'
import { ClientLoader } from '../loaders/client.loader'
import { Client } from '../models/client.model'
import { Consent } from '../models/consent.model'
import { ConsentTenant } from '../models/consentTenants.model'
import { ConsentService } from '../services/consent.service'
import { ConsentTenantsService } from '../services/consentTenants.service'

import type { User } from '@island.is/auth-nest-tools'
import type { ClientDataLoader } from '../loaders/client.loader'
@UseGuards(IdsUserGuard)
@Resolver(() => Consent)
export class ConsentResolver {
  constructor(
    private readonly consentService: ConsentService,
    private readonly consentTenantsService: ConsentTenantsService,
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

  @ResolveField('tenants', () => [ConsentTenant])
  resolveConsentTenants(
    @CurrentUser() user: User,
    @Parent() consent: Consent,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ): Promise<ConsentTenant[]> {
    return this.consentTenantsService.getPermissions(
      user,
      lang,
      consent.consentedScopes,
      consent.rejectedScopes,
    )
  }

  @Mutation(() => Boolean, { name: 'patchAuthConsent' })
  async patchConsent(
    @CurrentUser() user: User,
    @Args('input', { type: () => PatchConsentInput })
    input: PatchConsentInput,
  ): Promise<boolean> {
    await this.consentService.patchConsent(user, input)
    return true
  }
}

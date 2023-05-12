import { UseGuards } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { DomainLoader } from '../loaders/domain.loader'
import { Domain } from '../models'
import { ConsentTenant } from '../models/consentTenants.model'

import type { DomainDataLoader } from '../loaders/domain.loader'

@UseGuards(IdsUserGuard)
@Resolver(() => ConsentTenant)
export class ConsentTenantsResolver {
  @ResolveField('tenant', () => Domain)
  resolveTenant(
    @Loader(DomainLoader) domainLoader: DomainDataLoader,
    @Parent() consentTenant: ConsentTenant,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ) {
    return domainLoader.load({ lang, domain: consentTenant.domainName })
  }
}

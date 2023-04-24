import { UseGuards } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { DomainLoader } from '../loaders/domain.loader'
import { Domain } from '../models'
import { ScopePermissions } from '../models/scopePermissions.model'

import type { DomainDataLoader } from '../loaders/domain.loader'

@UseGuards(IdsUserGuard)
@Resolver(() => ScopePermissions)
export class ScopePermissionsResolver {
  @ResolveField('owner', () => Domain)
  resolvePermissions(
    @Loader(DomainLoader) domainLoader: DomainDataLoader,
    @Parent() permissions: ScopePermissions,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ) {
    return domainLoader.load({ lang, domain: permissions.domainId })
  }
}

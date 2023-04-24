import { UseGuards } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { DomainDataLoader, DomainLoader } from '../loaders/domain.loader'
import { Domain } from '../models'
import { ScopePermissions } from '../models/scopePermissions.model'

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

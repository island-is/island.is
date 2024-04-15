import { NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { Domain } from '../models/domain.model'
import { CustomDelegation } from '../models/delegation.model'
import { ISLAND_DOMAIN } from '../services/constants'
import { DomainLoader } from '../loaders/domain.loader'
import type { DomainDataLoader } from '../loaders/domain.loader'

@UseGuards(IdsUserGuard)
@Resolver(() => CustomDelegation)
export class CustomDelegationResolver {
  @ResolveField('domain', () => Domain)
  async resolveDomain(
    @Loader(DomainLoader) domainLoader: DomainDataLoader,
    @Parent() delegation: CustomDelegation,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ): Promise<Domain> {
    const domainName = delegation.domainName ?? ISLAND_DOMAIN
    const domain = await domainLoader.load({
      lang,
      domain: domainName,
    })

    if (!domain) {
      throw new NotFoundException(`Could not find domain: ${domainName}`)
    }

    return domain
  }
}

import { UseGuards } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { Loader } from '@island.is/nest/dataloader'

import { CustomDelegation, Domain } from '../models'
import { ISLAND_DOMAIN } from '../services-v1/constants'
import { DomainLoader } from '../loaders/domain.loader'
import type { DomainDataLoader } from '../loaders/domain.loader'

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@Resolver(() => CustomDelegation)
export class CustomDelegationResolver {
  @FeatureFlag(Features.outgoingDelegationsV2)
  @ResolveField('domain', () => Domain)
  async resolveDomain(
    @Loader(DomainLoader) domainLoader: DomainDataLoader,
    @Parent() delegation: CustomDelegation,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ): Promise<Domain> {
    return domainLoader.load({
      lang,
      domain: delegation.domainName ?? ISLAND_DOMAIN,
    })
  }
}

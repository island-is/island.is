import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

import { Domain } from '../models/domain.model'
import { DomainService } from '../services/domain.service'
import { DomainsInput } from '../dto/domains.input'

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@Resolver(() => Domain)
export class DomainResolver {
  constructor(private domain: DomainService) {}

  @FeatureFlag(Features.outgoingDelegationsV2)
  @Query(() => [Domain], {
    name: 'authDomains',
  })
  getDomains(
    @CurrentUser() user: User,
    @Args('input') input: DomainsInput,
  ): Promise<Domain[]> {
    return this.domain.getDomains(user, input)
  }
}

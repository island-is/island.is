import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

import { Domain } from '../models/domain.model'
import { DomainService } from '../services/domain.service'
import { DomainsInput } from '../dto/domains.input'
import { OrganizationLogoByTitleLoader } from '@island.is/cms'
import type { LogoUrl, OrganizationLogoByTitleDataLoader } from '@island.is/cms'
import { Loader } from '@island.is/nest/dataloader'

@UseGuards(IdsUserGuard)
@Resolver(() => Domain)
export class DomainResolver {
  constructor(private domain: DomainService) {}

  @Query(() => [Domain], {
    name: 'authDomains',
  })
  getDomains(
    @CurrentUser() user: User,
    @Args('input') input: DomainsInput,
  ): Promise<Domain[]> {
    return this.domain.getDomains(user, input)
  }

  @ResolveField('organisationLogoUrl', () => String, { nullable: true })
  async resolveOrganisationLogoUrl(
    @Loader(OrganizationLogoByTitleLoader)
    organizationLogoLoader: OrganizationLogoByTitleDataLoader,
    @Parent() domain: Domain,
  ): Promise<LogoUrl> {
    if (!domain.organisationLogoKey) {
      return null
    }
    return organizationLogoLoader.load(domain.organisationLogoKey)
  }
}

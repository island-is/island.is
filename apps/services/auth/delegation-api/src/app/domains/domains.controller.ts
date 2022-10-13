import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  ApiScopeTreeDTO,
  DelegationDomainsService,
  DelegationResourcesService,
  DomainDTO,
} from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth-api/v2/domains'

const domainName = {
  type: 'string',
  description: 'The domain name to the scope tree belongs to.',
}

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.outgoingDelegationsV2)
@ApiTags('domains')
@Controller({
  path: 'domains',
  version: ['1'],
})
@Audit({ namespace })
export class DomainsController {
  constructor(
    private readonly domainsService: DelegationDomainsService,
    private readonly resourceService: DelegationResourcesService,
  ) {}

  @Get()
  @Scopes(AuthScope.delegations)
  @FeatureFlag(Features.outgoingDelegationsV2)
  @Documentation({
    description: 'Get all domains supporting delegations.',
    response: { status: 200, type: [DomainDTO] },
  })
  async findAll(): Promise<DomainDTO[]> {
    return this.domainsService.findAll()
  }

  @Get(':domainName')
  @Scopes(AuthScope.delegations)
  @FeatureFlag(Features.outgoingDelegationsV2)
  @Documentation({
    description: 'Returns a single domain by name.',
    request: {
      params: {
        domainName,
      },
    },
    response: {
      status: 200,
      type: DomainDTO,
    },
  })
  async findOne(
    @Param('domainName') domainName: string,
  ): Promise<DomainDTO | null> {
    return this.domainsService.findOne(domainName)
  }

  @Get(':domainName/scope-tree')
  @Scopes(AuthScope.delegations)
  @FeatureFlag(Features.outgoingDelegationsV2)
  @Documentation({
    description: 'Returns a sorted scope tree for the given domain.',
    request: {
      params: {
        domainName,
      },
    },
    response: { status: 200, type: [ApiScopeTreeDTO] },
  })
  async findScopeTree(
    @Param('domainName') domainName: string,
  ): Promise<ApiScopeTreeDTO[]> {
    return this.resourceService.findScopeTree(domainName)
  }
}

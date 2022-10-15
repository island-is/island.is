import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
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

const lang = {
  description: 'The language to return display strings in.',
  required: false,
  type: 'string',
}

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.outgoingDelegationsV2)
@Scopes(AuthScope.delegations)
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
  @Documentation({
    description: 'Get all domains supporting delegations.',
    request: {
      query: {
        lang,
      },
    },
    response: { status: 200, type: [DomainDTO] },
  })
  async findAll(@Query('lang') language?: string): Promise<DomainDTO[]> {
    return this.domainsService.findAll(language)
  }

  @Get(':domainName')
  @Documentation({
    description: 'Returns a single domain by name.',
    request: {
      params: {
        domainName,
      },
      query: {
        lang,
      },
    },
    response: {
      status: 200,
      type: DomainDTO,
    },
  })
  async findOne(
    @Param('domainName') domainName: string,
    @Query('lang') language?: string,
  ): Promise<DomainDTO | null> {
    return this.domainsService.findOne(domainName, language)
  }

  @Get(':domainName/scope-tree')
  @Documentation({
    description: 'Returns a sorted scope tree for the given domain.',
    request: {
      params: {
        domainName,
      },
      query: {
        lang,
      },
    },
    response: { status: 200, type: [ApiScopeTreeDTO] },
  })
  async findScopeTree(
    @Param('domainName') domainName: string,
    @Query('lang') language?: string,
  ): Promise<ApiScopeTreeDTO[]> {
    return this.resourceService.findScopeTree(domainName, language)
  }
}

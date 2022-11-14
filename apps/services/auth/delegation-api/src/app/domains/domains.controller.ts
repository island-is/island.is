import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  ApiScopeTreeDTO,
  DelegationResourcesService,
  DomainDTO,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { Documentation } from '@island.is/nest/swagger'
import type {
  DocumentationParamOptions,
  DocumentationQueryOptions,
} from '@island.is/nest/swagger'

const namespace = '@island.is/auth/delegation-api/domains'

const domainName: DocumentationParamOptions = {
  type: 'string',
  description: 'The domain name to the scope tree belongs to.',
}

const lang: DocumentationQueryOptions = {
  description: 'The language to return display strings in.',
  required: false,
  type: 'string',
}

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.outgoingDelegationsV2)
@Scopes(AuthScope.delegations)
@ApiSecurity('ias')
@ApiTags('domains')
@Controller({
  path: 'domains',
  version: ['1'],
})
@Audit({ namespace })
export class DomainsController {
  constructor(private readonly resourceService: DelegationResourcesService) {}

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
  @Audit<DomainDTO[]>({
    resources: (domains) => domains.map((domain) => domain.name),
  })
  findAll(
    @CurrentUser() user: User,
    @Query('lang') language?: string,
  ): Promise<DomainDTO[]> {
    return this.resourceService.findAllDomains(user, language)
  }

  @Get(':domainName')
  @Documentation({
    description: 'Returns a single domain by name.',
    includeNoContentResponse: true,
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
  @Audit<DomainDTO>({
    resources: (domain) => domain.name,
  })
  findOne(
    @CurrentUser() user: User,
    @Param('domainName') domainName: string,
    @Query('lang') language?: string,
  ): Promise<DomainDTO> {
    return this.resourceService.findOneDomain(user, domainName, language)
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
  @Audit<ApiScopeTreeDTO[]>({
    resources: (scopeTree) => scopeTree.map((node) => node.name),
  })
  findScopeTree(
    @CurrentUser() user: User,
    @Param('domainName') domainName: string,
    @Query('lang') language?: string,
  ): Promise<ApiScopeTreeDTO[]> {
    return this.resourceService.findScopeTree(user, domainName, language)
  }

  @Get(':domainName/scopes')
  @Documentation({
    description: 'Returns a list of scopes for the given domain.',
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
  async findScopes(
    @CurrentUser() user: User,
    @Param('domainName') domainName: string,
    @Query('lang') language?: string,
  ): Promise<ApiScopeTreeDTO[]> {
    return this.resourceService.findScopes(user, domainName, language)
  }
}

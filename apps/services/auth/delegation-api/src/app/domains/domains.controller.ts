import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  ApiScopeListDTO,
  DelegationDirection,
  DelegationResourcesService,
  DomainDTO,
  ScopeTreeDTO,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { delegationScopes } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
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

const direction: DocumentationQueryOptions = {
  description:
    'The direction of the delegations to apply on domain filtering. Default returns all domains.',
  required: false,
  schema: {
    enum: [DelegationDirection.OUTGOING],
  },
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(...delegationScopes)
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
    description: `Get all domains. Provides query parameters to filter domains
      delegation support and/or specific delegation direction.`,
    request: {
      query: {
        lang,
        direction: {
          ...direction,
          description: `The direction of the delegations to apply on domain filtering.
            Setting this param implicitly filters by delegation support.
            Default returns all domains.`,
        },
        domainName: {
          description: 'A list of domain names to filter by.',
          required: false,
          isArray: true,
          type: 'string',
        },
        supportsDelegations: {
          description: `A boolean to filter by delegation support.
            If set to true, only domains with delegation support are returned.
            If set to false or not set, all domains are returned.
            This param is implicitly set to true when direction param is used.`,
          required: false,
          type: 'boolean',
        },
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
    @Query('direction') direction?: DelegationDirection,
    @Query('domainName') domainNames?: string[],
    @Query('supportsDelegations') supportsDelegations?: boolean,
  ): Promise<DomainDTO[]> {
    return this.resourceService.findAllDomains(user, {
      language,
      direction,
      domainNames,
      supportsDelegations,
    })
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
        direction,
      },
    },
    response: { status: 200, type: [ScopeTreeDTO] },
  })
  @Audit<ScopeTreeDTO[]>({
    resources: (scopeTree) => scopeTree.map((node) => node.name),
  })
  findScopeTree(
    @CurrentUser() user: User,
    @Param('domainName') domainName: string,
    @Query('lang') language?: string,
    @Query('direction') direction?: DelegationDirection,
  ): Promise<ScopeTreeDTO[]> {
    return this.resourceService.findScopeTree(
      user,
      domainName,
      language,
      direction,
    )
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
        direction,
      },
    },
    response: { status: 200, type: [ApiScopeListDTO] },
  })
  async findScopes(
    @CurrentUser() user: User,
    @Param('domainName') domainName: string,
    @Query('lang') language?: string,
    @Query('direction') direction?: DelegationDirection,
  ): Promise<ApiScopeListDTO[]> {
    return this.resourceService.findScopes(
      user,
      domainName,
      language,
      direction,
    )
  }
}

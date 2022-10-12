import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  DelegationScopeService,
  DomainDTO,
  DomainsService,
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

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.outgoingDelegationsV2)
@ApiTags('domains')
@Controller({
  path: 'domains',
  version: ['2'],
})
@Audit({ namespace })
export class DomainsController {
  constructor(
    private readonly domainsService: DomainsService,
    private readonly delegationScopeService: DelegationScopeService,
  ) {}

  @Get()
  @Scopes(AuthScope.delegations)
  @Documentation({})
  async findAll(): Promise<DomainDTO[]> {
    return this.domainsService.findAll()
  }

  @Get(':domainId')
  @Scopes(AuthScope.delegations)
  @Documentation({})
  async findOne(
    @Param('domainId') domainId: string,
  ): Promise<DomainDTO | null> {
    return this.domainsService.findOne(domainId)
  }

  @Get(':domainId/scope-tree')
  @Scopes(AuthScope.delegations)
  @Documentation({})
  async find(): Promise<DomainDTO[]> {
    return this.delegationScopeService.findScopeTree()
  }
}

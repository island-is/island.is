import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope, ApiScope } from '@island.is/auth/scopes'

import { RskCompanyRelatedParty } from '../models/rskCompanyRelatedParty.model'

import { RskCompany, RskCompanyInfo } from '../models/rskCompany.model'
import { RskCompanyInfoService } from '../rsk-company-info.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.company, AdminPortalScope.serviceDesk)
@Resolver(() => RskCompanyInfo)
export class RskCompanyInfoResolver {
  constructor(private readonly rskCompanyInfoService: RskCompanyInfoService) {}

  @ResolveField('relationships', () => [RskCompanyRelatedParty], {
    nullable: true,
  })
  async legalEntityRelationships(
    @CurrentUser() user: User,
    @Parent() { nationalId }: RskCompany,
  ): Promise<RskCompanyRelatedParty[] | null> {
    return this.rskCompanyInfoService.getLegalEntityRelationships(
      user,
      nationalId,
    )
  }
}

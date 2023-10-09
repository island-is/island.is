import { ForbiddenException, UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { RskCompanyRelatedParty } from '../models/rskCompanyRelatedParty.model'

import { RskCompany, RskCompanyInfo } from '../models/rskCompany.model'
import { RskCompanyInfoService } from '../rsk-company-info.service'

@UseGuards(IdsUserGuard, ScopesGuard)
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
    // We need to check the scope manually, since @Scopes() decorator does not take into account field resolver scopes.
    // It only checks the scope of the query/mutation.
    if (!user.scope.includes(AdminPortalScope.serviceDesk)) {
      throw new ForbiddenException('User does not have required scope')
    }

    return this.rskCompanyInfoService.getLegalEntityRelationships(
      user,
      nationalId,
    )
  }
}

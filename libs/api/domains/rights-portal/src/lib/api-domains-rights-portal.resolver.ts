import { Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import graphqlTypeJson from 'graphql-type-json'
import { RightsPortalService } from './api-domains-rights-portal.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/rights-portal' })
export class RightsPortalResolver {
  constructor(private readonly rightsPortalService: RightsPortalService) {}

  @Scopes(ApiScope.internal)
  @Query(() => graphqlTypeJson, { nullable: true })
  @Audit()
  async getRightsPortalTherapies() {
    return await this.rightsPortalService.getTherapies()
  }
}

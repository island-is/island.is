import { Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { RightsPortalService } from './api-domains-rights-portal.service'
import { Therapies } from './models/getTherapies.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/rights-portal' })
export class RightsPortalResolver {
  constructor(private readonly rightsPortalService: RightsPortalService) {}

  @Scopes(ApiScope.internal)
  @Query(() => [Therapies], { nullable: true })
  @Audit()
  async getRightsPortalTherapies(@CurrentUser() user: User) {
    return await this.rightsPortalService.getTherapies(user.nationalId)
  }
}

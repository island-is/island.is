import { Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { RightsPortalService } from './api-domains-rights-portal.service'
import { Therapies } from './models/getTherapies.model'
import { AidsAndNutrition } from './models/getAidsAndNutrition.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/rights-portal' })
export class RightsPortalResolver {
  constructor(private readonly rightsPortalService: RightsPortalService) {}

  @Scopes(ApiScope.health)
  @Query(() => [Therapies], {
    name: 'rightsPortalTherapies',
    nullable: true,
  })
  @Audit()
  getRightsPortalTherapies(@CurrentUser() user: User) {
    return this.rightsPortalService.getTherapies(user)
  }

  @Scopes(ApiScope.health)
  @Query(() => AidsAndNutrition, {
    name: 'rightsPortalAidsAndNutrition',
    nullable: true,
  })
  @Audit()
  getRightsPortalAidsAndNutrition(@CurrentUser() user: User) {
    return this.rightsPortalService.getAidsAndNutrition(user)
  }
}

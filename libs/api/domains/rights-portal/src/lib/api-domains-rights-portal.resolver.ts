import { Args, Query, Resolver } from '@nestjs/graphql'
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
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { HealthCenterHistory } from './models/getHealthCenter.model'
import { Dentists } from './models/getDentists.model'
import { GetDentistBillsInput } from './dto/getDentistBills.input'
import { GetHealthCenterHistoryInput } from './dto/getHealthCenterHistory.input'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
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

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => Dentists, {
    name: 'rightsPortalDentists',
    nullable: true,
  })
  @Audit()
  getRightsPortalDentists(
    @CurrentUser() user: User,
    @Args({
      name: 'input',
      nullable: true,
    })
    input?: GetDentistBillsInput,
  ) {
    return this.rightsPortalService.getDentists(
      user,
      input?.dateFrom,
      input?.dateTo,
    )
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => HealthCenterHistory, {
    name: 'rightsPortalHealthCenterHistory',
    nullable: true,
  })
  @Audit()
  getRightsPortalHealthCenterHistory(
    @CurrentUser() user: User,
    @Args({
      name: 'input',
      nullable: true,
    })
    input?: GetHealthCenterHistoryInput,
  ) {
    return this.rightsPortalService.getHealthCenterHistory(
      user,
      input?.dateFrom,
      input?.dateTo,
    )
  }
}

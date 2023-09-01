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
import { RightsPortalService } from './rightsPortal.service'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { HealthCenterHistory } from './models/healthCenter.model'
import { GetDentistBillsInput } from './dto/getDentistBills.input'
import { GetHealthCenterHistoryInput } from './dto/getHealthCenterHistory.input'
import { PaginatedTherapiesResponse } from './models/therapies.model'
import { UserDentist } from './models/userDentist.model'
import { PaginatedAidsAndNutritionResponse } from './models/aidsOrNutrition.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@Audit({ namespace: '@island.is/api/rights-portal' })
export class RightsPortalResolver {
  constructor(private readonly rightsPortalService: RightsPortalService) {}

  @Scopes(ApiScope.health)
  @Query(() => PaginatedTherapiesResponse, {
    name: 'rightsPortalPaginatedTherapiesResponse',
    nullable: true,
  })
  @Audit()
  async getRightsPortalTherapies(@CurrentUser() user: User) {
    const therapies = await this.rightsPortalService.getTherapies(user)

    return {
      data: therapies,
      totalCount: therapies?.length ?? 0,
      pageInfo: {
        hasNextPage: false, //until pagination is applied
      },
    }
  }

  @Scopes(ApiScope.health)
  @Query(() => PaginatedAidsAndNutritionResponse, {
    name: 'rightsPortalPaginatedAidsAndNutritionResponse',
    nullable: true,
  })
  @Audit()
  async getRightsPortalAidsAndNutrition(@CurrentUser() user: User) {
    return this.rightsPortalService.getAidsAndNutrition(user)
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => UserDentist, {
    name: 'rightsPortalUserDentist',
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

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => HealthCenterHistory, {
    name: 'rightsPortalHealthCenterHistory',
    nullable: true,
  })
  @Audit()
  getRightsPortalHealthCenterList(
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

  @Scopes(ApiScope.health)
  @Query(() => HealthCenterHistory, {
    name: 'rightsPortalDrugsPaymentPeroids',
  })
  @Audit()
  getRightsPortalDrugsPaymentPeroids() {
    return this.rightsPortalService.getDrugPaymentPeroids()
  }
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
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
import { GetDentistBillsInput } from './dto/getDentistBills.input'
import { GetHealthCenterHistoryInput } from './dto/getHealthCenterHistory.input'
import { PaginatedTherapiesResponse } from './models/therapies.model'
import { PaginatedAidsAndNutritionResponse } from './models/aidsOrNutrition.model'
import {
  PaginatedDentistsResponse,
  UserDentistRegistration,
} from './models/dentist.model'
import {
  PaginatedHealthCentersResponse,
  UserHealthCenterRegistration,
} from './models/healthCenter.model'
import { HealthCenterResponse } from './models/healthCenterResponse.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@Audit({ namespace: '@island.is/api/rights-portal' })
export class RightsPortalResolver {
  constructor(private readonly rightsPortalService: RightsPortalService) {}

  @Scopes(ApiScope.health)
  @Query(() => PaginatedTherapiesResponse, {
    name: 'rightsPortalPaginatedTherapies',
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
    name: 'rightsPortalPaginatedAidsAndNutrition',
    nullable: true,
  })
  @Audit()
  async getRightsPortalAidsAndNutrition(@CurrentUser() user: User) {
    return this.rightsPortalService.getAidsAndNutrition(user)
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => UserDentistRegistration, {
    name: 'rightsPortalUserDentistRegistration',
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
    return this.rightsPortalService.getDentistRegistrations(
      user,
      input?.dateFrom,
      input?.dateTo,
    )
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => UserHealthCenterRegistration, {
    name: 'rightsPortalUserHealthCenterRegistration',
    nullable: true,
  })
  @Audit()
  getRightsPortalHealthCenterRegistration(
    @CurrentUser() user: User,
    @Args({
      name: 'input',
      nullable: true,
    })
    input?: GetHealthCenterHistoryInput,
  ) {
    return this.rightsPortalService.getUserHealthCenterRegistrations(
      user,
      input?.dateFrom,
      input?.dateTo,
    )
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => PaginatedHealthCentersResponse, {
    name: 'rightsPortalPaginatedHealthCenters',
    nullable: true,
  })
  @Audit()
  getRightsPortalHealthCenterList(@CurrentUser() user: User) {
    return this.rightsPortalService.getHealthCenters(user)
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => PaginatedDentistsResponse, {
    name: 'rightsPortalPaginatedDentists',
    nullable: true,
  })
  @Audit()
  getRightsPortalDentistList(@CurrentUser() user: User) {
    return this.rightsPortalService.getDentists(user)
  }

  @Scopes(ApiScope.health)
  @Mutation(() => HealthCenterResponse, {
    name: 'rightsPortalTransferHealthCenter',
  })
  // @FeatureFlag(Features.servicePortalTransferHealthCenter)
  @Audit()
  transferHealthCenter(@CurrentUser() user: User, @Args('id') id: string) {
    return this.rightsPortalService.transferHealthCenter(user, id)
  }
}

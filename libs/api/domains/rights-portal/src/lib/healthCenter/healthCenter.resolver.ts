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
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { HealthCenterService } from './healthCenter.service'
import { PaginatedHealthCentersResponse } from './models/healthCenter.model'
import { HealthCenterHistoryInput } from './dto/healthCenterHistory.input'
import { HealthCenterRegistrationHistory } from './models/healthCenterRecordHistory.model'
import { HealthCenterRegisterResponse } from './models/healthCenterTransfer.model'
import { HealthCenterRegisterInput } from './dto/healthCenterTransfer.input'
import { HealthCenterDoctorsInput } from './dto/healthCenterDoctors.input'
import { HealthCenterDoctors } from './models/healthCenterDoctors.model'
@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@Audit({ namespace: '@island.is/api/rights-portal/health-center' })
export class HealthCenterResolver {
  constructor(private readonly service: HealthCenterService) {}

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => HealthCenterRegistrationHistory, {
    name: 'rightsPortalHealthCenterRegistrationHistory',
    nullable: true,
  })
  @Audit()
  getRightsPortalHealthCenterRegistration(
    @CurrentUser() user: User,
    @Args({
      name: 'input',
      nullable: true,
    })
    input?: HealthCenterHistoryInput,
  ) {
    return this.service.getHealthCentersRegistrationHistory(
      user,
      input?.dateFrom,
      input?.dateTo,
    )
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => [HealthCenterDoctors], {
    name: 'rightsPortalHealthCenterDoctors',
    nullable: true,
  })
  @Audit()
  getRightsPortalHealthCenterDoctors(
    @CurrentUser() user: User,
    @Args('input') input: HealthCenterDoctorsInput,
  ) {
    console.log({ input })

    return this.service.getHealthCenterDoctors(user, input)
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => PaginatedHealthCentersResponse, {
    name: 'rightsPortalPaginatedHealthCenters',
    nullable: true,
  })
  @Audit()
  getRightsPortalHealthCenterList(@CurrentUser() user: User) {
    return this.service.getHealthCenters(user)
  }

  @Scopes(ApiScope.health)
  @Mutation(() => HealthCenterRegisterResponse, {
    name: 'rightsPortalRegisterHealthCenter',
  })
  @Audit()
  registerHealthCenter(
    @CurrentUser() user: User,
    @Args('input') input: HealthCenterRegisterInput,
  ) {
    return this.service.registerHealthCenter(user, input)
  }
}

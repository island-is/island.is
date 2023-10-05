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
import { DentistService } from './denstist.service'
import { DentistRegistration } from './models/registration.model'
import { DentistBillsInput } from './dto/bills.input'
import { DentistStatus } from './models/status.model'
import { DentistRegisterInput } from './dto/register.input'
import { PaginatedDentistsResponse } from './models/dentist.model'
import { DentistsInput } from './dto/dentist.input'
import { DentistRegisterResponse } from './models/registerResponse.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@Audit({ namespace: '@island.is/api/rights-portal/dentist' })
export class RightsPortalResolver {
  constructor(private readonly service: DentistService) {}

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => DentistRegistration, {
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
    input?: DentistBillsInput,
  ) {
    return this.service.getDentistRegistrations(
      user,
      input?.dateFrom,
      input?.dateTo,
    )
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => DentistStatus, {
    name: 'rightsPortalDentistStatus',
    nullable: true,
  })
  @Audit()
  getDentistStatus(@CurrentUser() user: User) {
    return this.service.getDentistStatus(user)
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => DentistStatus, {
    name: 'rightsPortalCurrentDentist',
    nullable: true,
  })
  @Audit()
  getCurrentDentist(@CurrentUser() user: User) {
    return this.service.getDentistStatus(user)
  }

  @FeatureFlag(Features.servicePortalTransferHealthCenter)
  @Scopes(ApiScope.health)
  @Mutation(() => DentistRegisterResponse, {
    name: 'rightsPortalRegisterDentist',
  })
  @Audit()
  registerDentist(
    @CurrentUser() user: User,
    @Args('input') input: DentistRegisterInput,
  ) {
    return this.service.registerDentist(user, input.id)
  }

  @FeatureFlag(Features.servicePortalHealthCenterDentistPage)
  @Scopes(ApiScope.health)
  @Query(() => PaginatedDentistsResponse, {
    name: 'rightsPortalPaginatedDentists',
    nullable: true,
  })
  @Audit()
  getRightsPortalDentistList(
    @CurrentUser() user: User,
    @Args('input') input: DentistsInput,
  ) {
    return this.service.getDentists(user, input)
  }
}

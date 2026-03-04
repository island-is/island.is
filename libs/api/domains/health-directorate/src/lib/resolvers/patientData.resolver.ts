import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import type { Locale } from '@island.is/shared/types'

import { PermitInput } from '.././dto/permit.input'
import { HealthDirectorateService } from '.././health-directorate.service'
import { Countries } from '.././models/permits/country.model'
import { PermitReturn } from '.././models/permits/permitReturn.model'
import { Permits } from '.././models/permits/permits.model'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver()
export class PatientDataResolver {
  constructor(private api: HealthDirectorateService) {}

  /* Patient data - Permits */

  @Query(() => Permits, {
    name: 'healthDirectoratePatientDataPermits',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthPatientPermitsPageEnabled)
  getPermits(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Permits | null> {
    return this.api.getPermits(user, locale)
  }

  @Query(() => Countries, {
    name: 'healthDirectoratePatientDataPermitCountries',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthPatientPermitsPageEnabled)
  getPermitCountries(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @CurrentUser() user: User,
  ): Promise<Countries | null> {
    return this.api.getPermitCountries(user, locale)
  }

  @Mutation(() => PermitReturn, {
    nullable: true,
    name: 'healthDirectoratePatientDataCreatePermit',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthPatientPermitsPageEnabled)
  async createPermit(
    @Args('input') input: PermitInput,
    @CurrentUser() user: User,
  ): Promise<PermitReturn | null> {
    return this.api.createPermit(user, input)
  }

  @Mutation(() => PermitReturn, {
    nullable: true,
    name: 'healthDirectoratePatientDataInvalidatePermit',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthPatientPermitsPageEnabled)
  async invalidatePermit(
    @CurrentUser() user: User,
  ): Promise<PermitReturn | null> {
    return this.api.invalidatePermit(user)
  }
}

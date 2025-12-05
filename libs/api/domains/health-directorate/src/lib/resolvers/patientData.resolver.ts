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

import {
  InvalidatePermitInput,
  PermitInput,
  PermitsInput,
} from '.././dto/permit.input'
import { HealthDirectorateService } from '.././health-directorate.service'
import { Countries } from '.././models/permits/country.model'
import { Permit, PermitReturn, Permits } from '.././models/permits/permits'

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
    @Args('input', { type: () => PermitsInput })
    input: PermitsInput,
    @CurrentUser() user: User,
  ): Promise<Permits | null> {
    return this.api.getPermits(user, locale, input)
  }

  @Query(() => Permit, {
    name: 'healthDirectoratePatientDataPermit',
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.servicePortalHealthPatientPermitsPageEnabled)
  getPermit(
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<Permit | null> {
    return this.api.getPermit(user, locale, id)
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
    @Args('input') input: InvalidatePermitInput,
    @CurrentUser() user: User,
  ): Promise<PermitReturn | null> {
    return this.api.invalidatePermit(user, input)
  }
}

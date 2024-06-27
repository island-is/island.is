import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'

import type { Locale } from '@island.is/shared/types'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GetGenericLicensesInput } from '../dto/GetGenericLicenses.input'
import { LicenseServiceV2 } from '../licenseService.service'
import { LicenseCollection } from '../dto/GenericLicenseCollection.dto'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver(() => LicenseCollection)
@FeatureFlag(Features.licensesV2)
@Audit({ namespace: '@island.is/api/license-service-v2' })
export class LicenseCollectionResolver {
  constructor(private readonly licenseServiceService: LicenseServiceV2) {}

  @Query(() => LicenseCollection, {
    name: 'licenseServiceV2GenericLicenseCollection',
  })
  @Audit()
  async genericLicenseCollection(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GetGenericLicensesInput,
  ) {
    return this.licenseServiceService.getLicenseCollection(user, locale, {
      ...input,
      includedTypes: input?.includedTypes ?? ['DriversLicense'],
      excludedTypes: input?.excludedTypes,
      force: input?.force,
      onlyList: input?.onlyList,
    })
  }
}

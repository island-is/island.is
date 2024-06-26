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
import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GenericUserLicense } from '../dto/GenericUserLicense.dto'
import { GetGenericLicensesInput } from '../dto/GetGenericLicenses.input'
import { LicenseServiceService } from '../licenseService.service'
import { LicenseCollection } from '../dto/GenericLicenseCollection.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver(() => LicenseCollection)
@Audit({ namespace: '@island.is/api/license-service' })
export class LicenseCollectionResolver {
  constructor(private readonly licenseServiceService: LicenseServiceService) {}

  @Query(() => LicenseCollection)
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

  @Query(() => [GenericUserLicense], {
    deprecationReason: 'Use genericLicenseCollection instead',
  })
  @Directive(
    '@deprecated(reason: "Deprecated in favor of genericLicenseCollection")',
  )
  @Audit()
  async genericLicenses(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input', { nullable: true }) input?: GetGenericLicensesInput,
  ) {
    const licenseCollection =
      await this.licenseServiceService.getLicenseCollection(user, locale, {
        includedTypes: input?.includedTypes ?? ['DriversLicense'],
        excludedTypes: input?.excludedTypes,
        force: input?.force,
        onlyList: input?.onlyList,
      })

    return licenseCollection.licenses
  }
}

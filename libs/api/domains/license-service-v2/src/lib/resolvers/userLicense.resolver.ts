import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope, LicenseApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import type { Locale } from '@island.is/shared/types'
import { ForbiddenException, UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { CreateBarcodeResult } from '../dto/CreateBarcodeResult.dto'
import { GenericUserLicense } from '../dto/GenericUserLicense.dto'
import { GetGenericLicenseInput } from '../dto/GetGenericLicense.input'
import { LicenseServiceV2 } from '../licenseService.service'
import { LicenseError } from '../dto/GenericLicenseError.dto'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.licensesV2)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver(() => GenericUserLicense)
@Audit({ namespace: '@island.is/api/license-service-v2' })
export class UserLicenseResolver {
  constructor(private readonly licenseServiceService: LicenseServiceV2) {}

  @Query(() => GenericUserLicense, {
    nullable: true,
    name: 'licenseServiceV2GenericLicense',
  })
  @Audit()
  async genericLicense(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GetGenericLicenseInput,
  ) {
    const license = await this.licenseServiceService.getLicense(
      user,
      locale,
      input.licenseType,
      input.licenseId,
    )

    if (license instanceof LicenseError) {
      return null
    }

    return license
  }

  @ResolveField('barcode', () => CreateBarcodeResult, { nullable: true })
  async resolveBarcode(
    @CurrentUser() user: User,
    @Parent() genericUserLicense: GenericUserLicense,
  ): Promise<CreateBarcodeResult | null> {
    if (!user.scope.includes(LicenseApiScope.licensesBarcode)) {
      throw new ForbiddenException(
        'User does not have permission to create barcode',
      )
    }

    return this.licenseServiceService.createBarcode(user, genericUserLicense)
  }
}

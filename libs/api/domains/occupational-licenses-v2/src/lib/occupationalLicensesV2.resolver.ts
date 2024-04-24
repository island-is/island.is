import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { Inject, UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { OccupationalLicensesV2Service } from './occupationalLicensesV2.service'
import { LicenseInput } from './dto/licenseInput.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { LicenseCollection } from './models/licenseCollection.model'
import { getLicenseTypeByIdPrefix } from './utils'
import { LicenseResponse } from './models/licenseResponse.model'
import { LicenseResult } from './models/licenseResult.model'
import { isDefined } from '@island.is/shared/utils'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

@UseGuards(IdsUserGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/occupational-licenses-v2' })
@Scopes(ApiScope.internal)
@FeatureFlag(Features.occupationalLicensesV2)
@Resolver(() => LicenseCollection)
export class OccupationalLicensesV2Resolver {
  constructor(
    private readonly service: OccupationalLicensesV2Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => LicenseCollection, {
    name: 'occupationalLicensesV2',
    nullable: true,
  })
  @Audit()
  async occupationalLicensesV2(
    @CurrentUser() user: User,
  ): Promise<LicenseCollection | null> {
    const data = await Promise.all([
      this.service.getHealthDirectorateLicenses(user),
      this.service.getEducationLicenses(user),
      this.service.getDistrictCommissionerLicenses(user),
    ])

    let normalizedResults: Array<typeof LicenseResult> = []
    data.filter(isDefined).forEach((result) => {
      Array.isArray(result)
        ? (normalizedResults = normalizedResults.concat(result))
        : normalizedResults.push(result)
    })

    return {
      licenses: normalizedResults,
    }
  }

  @Query(() => LicenseResponse, {
    name: 'occupationalLicenseV2',
    nullable: true,
  })
  @Audit()
  async license(
    @CurrentUser() user: User,
    @Args('input') input: LicenseInput,
  ): Promise<LicenseResponse | null> {
    const licenseType = getLicenseTypeByIdPrefix(input.id)

    if (!licenseType) {
      throw new Error('Invalid license id')
    }

    switch (licenseType.type) {
      case 'DistrictCommissioners':
        return this.service.getDistrictCommissionerLicenseById(
          user,
          licenseType.licenseId,
        )
      case 'Education':
        return this.service.getEducationLicenseById(
          user,
          input.locale,
          licenseType.licenseId,
        )
      case 'Health':
        return this.service.getHealthDirectorateLicenseById(
          user,
          licenseType.licenseId,
        )
    }
  }
}

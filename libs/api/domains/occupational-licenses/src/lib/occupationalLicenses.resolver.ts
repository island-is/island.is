import { CurrentUser, IdsUserGuard, Scopes } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { LicenseInput } from './dto/licenseInput.model'
import { LicenseCollection } from './models/licenseCollection.model'
import { getLicenseTypeByIdPrefix } from './utils'
import { LicenseResponse } from './models/licenseResponse.model'
import { LicenseResult } from './models/licenseResult.model'
import { isDefined } from '@island.is/shared/utils'
import { OccupationalLicensesService } from './occupationalLicenses.service'
import { LicenseType } from './models/licenseType.model'
import type { Locale } from '@island.is/shared/types'

@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/occupational-licenses' })
@Scopes(ApiScope.internal)
@Resolver(() => LicenseCollection)
export class OccupationalLicensesResolver {
  constructor(private readonly service: OccupationalLicensesService) {}

  @Query(() => LicenseCollection, {
    name: 'occupationalLicenses',
    nullable: true,
  })
  @Audit()
  async occupationalLicenses(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ): Promise<LicenseCollection | null> {
    const data = await Promise.all([
      this.service.getHealthDirectorateLicenses(user, locale),
      this.service.getEducationLicenses(user, locale),
      this.service.getDistrictCommissionerLicenses(user, locale),
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
    name: 'occupationalLicense',
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
      case LicenseType.DISTRICT_COMMISSIONERS:
        return this.service.getDistrictCommissionerLicenseById(
          user,
          licenseType.licenseId,
          input.locale,
        )
      case LicenseType.EDUCATION:
        return this.service.getEducationLicenseById(
          user,
          input.locale,
          licenseType.licenseId,
        )
      case LicenseType.HEALTH_DIRECTORATE:
        return this.service.getHealthDirectorateLicenseById(
          user,
          licenseType.licenseId,
          input.locale,
        )
    }
  }
}

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
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { OccupationalLicensesV2Service } from './occupationalLicensesV2.service'
import { LicenseInput } from './dto/licenseInput.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { LicensesCollection } from './models/licenseCollectionResponse.model'
import { getLicenseTypeByIdPrefix } from './utils'
import { LicenseResponse } from './models/licenseResponse.model'
import { License } from './models/license.model'

@UseGuards(IdsUserGuard, IdsAuthGuard)
@Scopes(ApiScope.internal)
@Resolver(() => LicensesCollection)
export class OccupationalLicensesV2Resolver {
  constructor(
    private readonly service: OccupationalLicensesV2Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => LicensesCollection, {
    name: 'occupationalLicensesV2',
    nullable: true,
  })
  @Audit()
  async occupationalLicensesV2(): Promise<LicensesCollection | null> {
    return {}
  }

  @ResolveField('education', () => [License], { nullable: true })
  async educationLicense(
    @CurrentUser() user: User,
  ): Promise<Array<License> | null> {
    return this.service.getEducationLicenses(user)
  }

  @ResolveField('health', () => [License], { nullable: true })
  async healthLicense(
    @CurrentUser() user: User,
  ): Promise<Array<License> | null> {
    return this.service.getHealthDirectorateLicenses(user)
  }

  @ResolveField('districtCommissioners', () => [License], {
    nullable: true,
  })
  async districtCommissionersLicense(
    @CurrentUser() user: User,
  ): Promise<Array<License> | null> {
    return this.service.getDistrictCommissionerLicenses(user)
  }

  @Query(() => LicenseResponse, {
    name: 'occupationalLicenseV2',
    nullable: true,
  })
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

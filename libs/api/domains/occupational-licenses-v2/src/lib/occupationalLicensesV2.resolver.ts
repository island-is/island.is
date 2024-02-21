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
import { ProblemError } from '@island.is/nest/problem'
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { License } from './models/license.model'
import { OccupationalLicensesV2Service } from './occupationalLicensesV2.service'
import { EducationLicense } from './models/educationLicense.model'
import { HealthDirectorateLicense } from './models/healthDirectorateLicense.model'
import { ProblemType } from '@island.is/shared/problem'
import { LicenseInput } from './dto/licenseInput.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { LicensesCollection } from './models/licenseCollectionResponse.model'
import { getLicenseTypeByIdPrefix } from './utils'

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
  async occupationalLicensesV2(
    @CurrentUser() user: User,
  ): Promise<LicensesCollection | null> {
    const data =
      (await this.service.getDistrictCommissionerLicenses(user)) ?? []
    return {
      districtCommissioners: data,
    }
  }

  @ResolveField('education', () => [EducationLicense], { nullable: true })
  async educationLicense(
    @CurrentUser() user: User,
  ): Promise<Array<EducationLicense> | null> {
    throw new ProblemError({
      type: ProblemType.HTTP_FORBIDDEN,
      title: 'rbjiao',
    })
    return this.service.getEducationLicenses(user)
  }

  @ResolveField('health', () => [HealthDirectorateLicense], { nullable: true })
  async healthLicense(
    @CurrentUser() user: User,
  ): Promise<Array<HealthDirectorateLicense> | null> {
    return this.service.getHealthDirectorateLicenses(user)
  }

  @Query(() => License, {
    name: 'occupationalLicenseV2',
    nullable: true,
  })
  async license(
    @CurrentUser() user: User,
    @Args('input') input: LicenseInput,
  ): Promise<License | null> {
    const licenseType = getLicenseTypeByIdPrefix(input.id)

    if (!licenseType) {
      throw new Error('Invalid license id')
    }

    let licenseFunction: (user: User, id: string) => Promise<License | null>
    switch (licenseType.type) {
      case 'DistrictCommissioners':
        licenseFunction = this.service.getDistrictCommissionerLicenseById
        break
      case 'Education':
        licenseFunction = this.service.getEducationLicenseById
        break
      case 'Health':
        licenseFunction = this.service.getHealthDirectorateLicenseById
        break
    }
    return licenseFunction(user, licenseType.licenseId)
  }
}

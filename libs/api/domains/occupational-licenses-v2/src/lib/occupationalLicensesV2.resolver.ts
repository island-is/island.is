import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Query, ResolveField, Resolver } from '@nestjs/graphql'
import { OccupationalLicensesV2Service } from './occupationalLicensesV2.service'
import { LicensesV2Response } from './models/occupationalLicenseResponse.model'
import { HealthDirectorateLicense } from './models/healthDirectorateLicense.model'
import { EducationLicense } from './models/educationLicense.model'
import { DistrictCommissionersLicense } from './models/districtCommissionersLicense.model'

@UseGuards(IdsUserGuard, IdsAuthGuard)
@Scopes(ApiScope.internal)
@Resolver(() => LicensesV2Response)
export class OccupationalLicensesV2Resolver {
  constructor(private readonly service: OccupationalLicensesV2Service) {}

  @Query(() => LicensesV2Response, {
    name: 'occupationalLicensesV2',
    nullable: true,
  })
  @Audit()
  async occupationalLicensesV2(
    @CurrentUser() user: User,
  ): Promise<LicensesV2Response | null> {
    const data =
      (await this.service.getDistrictCommissionerLicenses(user)) ?? []
    return {
      districtCommissioners: data,
    }
  }

  @ResolveField('health')
  async health(
    @CurrentUser() user: User,
  ): Promise<Array<HealthDirectorateLicense> | null> {
    return this.service.getHealthDirectorateLicenses(user)
  }

  @ResolveField('education')
  async education(
    @CurrentUser() user: User,
  ): Promise<Array<EducationLicense> | null> {
    return this.service.getEducationLicenses(user)
  }
  @ResolveField('districtCommissioners')
  async districtCommissioners(
    @CurrentUser() user: User,
  ): Promise<Array<DistrictCommissionersLicense> | null> {
    return this.service.getDistrictCommissionerLicenses(user)
  }
}

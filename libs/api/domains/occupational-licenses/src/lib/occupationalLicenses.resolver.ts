import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { OccupationalLicensesService } from './occupationalLicenses.service'
import { OccupationalLicenseResponse } from './models/occupationalLicense.model'
import { ApiScope } from '@island.is/auth/scopes'
import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { OccupationalLicensesList } from './models/occupationalLicenseList.model'
@UseGuards(IdsUserGuard, IdsAuthGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class OccupationalLicensesResolver {
  constructor(
    private readonly occupationalLicensesApi: OccupationalLicensesService,
  ) {}

  @Query(() => OccupationalLicensesList, {
    name: 'occupationalLicenses',
    nullable: true,
  })
  @Audit()
  async occupationalLicenses(@CurrentUser() user: User) {
    return await this.occupationalLicensesApi.getOccupationalLicenses(user)
  }

  @Query(() => OccupationalLicenseResponse, {
    name: 'occupationalLicensesHealthDirectorateLicense',
    nullable: true,
  })
  @FeatureFlag(Features.occupationalLicensesHealthDirectorate)
  @Audit()
  async getHealthDirectorateLicenseById(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return await this.occupationalLicensesApi.getHealthDirectorateLicenseById(
      user,
      id,
    )
  }

  @Query(() => OccupationalLicenseResponse, {
    name: 'occupationalLicensesEducationalLicense',
    nullable: true,
  })
  @Audit()
  async getEducationalLicenseById(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.occupationalLicensesApi.getEducationalLicensesById(user, id)
  }
}

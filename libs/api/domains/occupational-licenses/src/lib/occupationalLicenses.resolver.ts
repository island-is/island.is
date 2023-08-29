import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { Inject, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { OccupationalLicensesList } from './models/occupationalLicenseList.model'
import { OccupationalLicensesService } from './occupationalLicenses.service'
import { handle404 } from '@island.is/clients/middlewares'
import { ConfigType } from '@nestjs/config'
import { DownloadServiceConfig } from '@island.is/nest/config'
import {
  HealthDirectorateLicense,
  EducationalLicense,
} from './models/occupationalLicense.model'

@UseGuards(IdsUserGuard, IdsAuthGuard)
@Resolver()
export class OccupationalLicensesResolver {
  constructor(
    private readonly occupationalLicensesApi: OccupationalLicensesService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadService: ConfigType<typeof DownloadServiceConfig>,
  ) {}

  @Query(() => OccupationalLicensesList, {
    name: 'occupationalLicenses',
    nullable: true,
  })
  @Audit()
  async occupationalLicenses(@CurrentUser() user: User) {
    return await this.occupationalLicensesApi
      .getOccupationalLicenses(user)
      .catch(handle404)
  }

  @Query(() => HealthDirectorateLicense, {
    name: 'OccupationalLicensesHealthDirectorateLicense',
    nullable: true,
  })
  @Audit()
  async getHealthDirectorateLicenseById(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    const license = await this.occupationalLicensesApi
      .getHealthDirectorateLicenseById(user, id)
      .catch(handle404)

    return license ? license : null
  }

  @Query(() => EducationalLicense, {
    name: 'OccupationalLicensesEducationalLicense',
    nullable: true,
  })
  @Audit()
  async getEducationalLicenseById(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    const documentUrl = `${this.downloadService.baseUrl}/download/v1/occupational-licenses/education?id=${id}`
    const license = await this.occupationalLicensesApi
      .getEducationalLicensesById(user, id)
      .catch(handle404)

    return license
      ? {
          ...license,
          url: documentUrl,
        }
      : null
  }
}

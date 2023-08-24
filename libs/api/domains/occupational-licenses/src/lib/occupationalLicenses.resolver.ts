import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { Inject, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { OccupationalLicenseList } from './models/occupationalLicenseList.model'
import { OccupationalLicensesService } from './occupationalLicenses.service'
import { handle404 } from '@island.is/clients/middlewares'
import { HealthDirectorateLicense } from './models/healthDirectorateLicense.model'
import { EducationalLicense } from './models/educationalLicense.model'
import { ConfigType } from '@nestjs/config'
import { DownloadServiceConfig } from '@island.is/nest/config'

@UseGuards(IdsUserGuard, IdsAuthGuard)
@Resolver()
export class OccupationalLicensesResolver {
  constructor(
    private readonly occupationalLicensesApi: OccupationalLicensesService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadService: ConfigType<typeof DownloadServiceConfig>,
  ) {}

  @Query(() => OccupationalLicenseList, {
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
    name: 'occupationalLicenseHealthDirectorateLicense',
    nullable: true,
  })
  @Audit()
  async getHealthDirectorateLicenseById(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return await this.occupationalLicensesApi
      .getHealthDirectorateLicenseById(user, id)
      .catch(handle404)
  }

  @Query(() => EducationalLicense, {
    name: 'occupationalLicenseEducationalLicense',
    nullable: true,
  })
  @Audit()
  async getEdicationalLicenseById(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    const documentUrl = `${this.downloadService.baseUrl}/download/v1/occupational-licenses/education?id=${id}`
    const license = await this.occupationalLicensesApi
      .getEducationalLicensesById(user, id)
      .catch(handle404)

    return {
      ...license,
      url: documentUrl,
    }
  }
}

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
  OccupationalLicense,
} from './models/occupationalLicense.model'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
@UseGuards(IdsUserGuard, IdsAuthGuard)
@Resolver()
export class OccupationalLicensesResolver {
  constructor(
    private readonly occupationalLicensesApi: OccupationalLicensesService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadService: ConfigType<typeof DownloadServiceConfig>,

    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
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
    name: 'occupationalLicensesHealthDirectorateLicense',
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
    name: 'occupationalLicensesEducationalLicense',
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
          downloadUrl: documentUrl,
        }
      : null
  }

  @Query(() => OccupationalLicense, {
    name: 'occupationalLicense',
    nullable: true,
  })
  @Audit()
  async getOccupationalLicense(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    const isEduLicense = await this.getEducationalLicenseById(user, id)
    if (isEduLicense !== null) {
      return {
        id: isEduLicense.id,
        isValid: isEduLicense.isValid,
        profession: isEduLicense.profession,
        type: isEduLicense.type,
        validFrom: isEduLicense.validFrom,
        downloadUrl: isEduLicense.downloadUrl,
      }
    }

    const isHealthLicense = await this.getHealthDirectorateLicenseById(user, id)
    if (isHealthLicense !== null) {
      return {
        id: isHealthLicense.id,
        isValid: isHealthLicense.isValid,
        profession: isHealthLicense.profession,
        type: isHealthLicense.type,
        validFrom: isHealthLicense.validFrom,
      }
    }

    return null
  }
}

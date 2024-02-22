import { CurrentUser } from '@island.is/auth-nest-tools'
import slugify from '@sindresorhus/slugify'
import capitalize from 'lodash/capitalize'
import type { User } from '@island.is/auth-nest-tools'
import { Inject } from '@nestjs/common'
import {
  DistrictCommissionersLicensesService,
  RettindiFyrirIslandIsApi,
} from '@island.is/clients/district-commissioners-licenses'
import { HealthDirectorateClientService } from '@island.is/clients/health-directorate'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { OccupationalLicenseStatusV2 } from './models/license.model'
import { isDefined } from '@island.is/shared/utils'
import { MMSApi } from '@island.is/clients/mms'
import { HealthDirectorateLicense } from './models/healthDirectorateLicense.model'
import { info } from 'kennitala'
import { EducationLicense } from './models/educationLicense.model'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { DistrictCommissionersLicense } from './models/districtCommissionersLicense.model'
import {
  addLicenseTypePrefix,
  mapDistrictCommissionersLicenseStatusToStatus,
} from './utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

export class OccupationalLicensesV2Service {
  constructor(
    private readonly dcService: DistrictCommissionersLicensesService,
    private readonly dcApi: RettindiFyrirIslandIsApi,
    private readonly healthService: HealthDirectorateClientService,
    private readonly mmsApi: MMSApi,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadService: ConfigType<typeof DownloadServiceConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}
  async getDistrictCommissionerLicenses(
    user: User,
  ): Promise<DistrictCommissionersLicense[] | null> {
    const licenses = await this.dcService.getLicenses(user)

    if (!licenses) {
      return []
    }

    const issuer: OrganizationSlugType = 'syslumenn'

    const data: Array<DistrictCommissionersLicense> =
      licenses
        ?.map((l) => {
          if (!l || !l.status || !l.title || !l.validFrom) {
            return
          }

          return {
            ...l,
            licenseId: addLicenseTypePrefix(l.id, 'DistrictCommissioners'),
            licenseNumber: l.id,
            issuer,
            profession: l.title,
            dateOfBirth: info(user.nationalId).birthday,
            validFrom: l.validFrom,
            status: mapDistrictCommissionersLicenseStatusToStatus(l.status),
          }
        })
        .filter(isDefined) ?? []

    return data
  }
  async getDistrictCommissionerLicenseById(
    user: User,
    id: string,
  ): Promise<DistrictCommissionersLicense | null> {
    const license = await this.dcService.getLicense(user, id)

    if (!license) {
      return null
    }

    if (
      !license.id ||
      !license.status ||
      !license.title ||
      !license.validFrom
    ) {
      return null
    }

    const issuer: OrganizationSlugType = 'syslumenn'

    return {
      licenseId: addLicenseTypePrefix(license.id, 'DistrictCommissioners'),
      licenseNumber: license.id,
      issuer,
      profession: license.title,
      dateOfBirth: info(user.nationalId).birthday,
      validFrom: license.validFrom,
      status: mapDistrictCommissionersLicenseStatusToStatus(license.status),
      title: license.title,
    }
  }

  async getHealthDirectorateLicenses(
    @CurrentUser() user: User,
  ): Promise<Array<HealthDirectorateLicense> | null> {
    const licenses =
      await this.healthService.getHealthDirectorateLicenseToPractice(user)

    const issuer: OrganizationSlugType = 'landlaeknir'

    return (
      licenses
        ?.map((l) => {
          let status: OccupationalLicenseStatusV2
          switch (l.status) {
            case 'LIMITED':
              status = OccupationalLicenseStatusV2.LIMITED
              break
            case 'VALID':
              status = OccupationalLicenseStatusV2.VALID
              break
            default:
              status = OccupationalLicenseStatusV2.ERROR
          }
          return {
            ...l,
            licenseId: addLicenseTypePrefix(l.licenseNumber, 'Health'),
            issuer,
            type: l.practice,
            profession: slugify(l.profession.toLowerCase()),
            licenseNumber: l.licenseNumber,
            title: l.profession,
            id: l.id,
            dateOfBirth: info(l.licenseHolderNationalId).birthday,
            status,
          }
        })
        .filter(isDefined) ?? []
    )
  }

  async getHealthDirectorateLicenseById(
    @CurrentUser() user: User,
    id: string,
  ): Promise<HealthDirectorateLicense | null> {
    const licenses = await this.getHealthDirectorateLicenses(user)

    return licenses?.find((l) => l.licenseNumber === id) ?? null
  }

  async getEducationLicenses(
    @CurrentUser() user: User,
  ): Promise<EducationLicense[] | null> {
    const licenses = await this.mmsApi.getLicenses(user.nationalId)

    const issuer: OrganizationSlugType = 'menntamalastofnun'

    const data: Array<EducationLicense> =
      licenses
        .map((l) => {
          return {
            licenseId: addLicenseTypePrefix(l.id, 'Education'),
            licenseNumber: l.id,
            issuer,
            profession: l.type,
            licenseHolderName: l.fullName,
            licenseHolderNationalId: l.nationalId,
            title: capitalize(l.type),
            dateOfBirth: info(l.nationalId).birthday,
            downloadUrl: `${this.downloadService.baseUrl}/download/v1/occupational-licenses/education/${l.id}`,
            validFrom: new Date(l.issued),
            status:
              new Date(l.issued) < new Date()
                ? OccupationalLicenseStatusV2.VALID
                : OccupationalLicenseStatusV2.ERROR,
          }
        })
        .filter(isDefined) ?? []

    return data
  }

  async getEducationLicenseById(
    @CurrentUser() user: User,
    id: string,
  ): Promise<EducationLicense | null> {
    const licenses = await this.getEducationLicenses(user)

    return licenses?.find((l) => l.licenseNumber === id) ?? null
  }
}

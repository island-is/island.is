import { type Locale } from '@island.is/shared/types'
import { CurrentUser } from '@island.is/auth-nest-tools'
import capitalize from 'lodash/capitalize'
import type { User } from '@island.is/auth-nest-tools'
import { Inject } from '@nestjs/common'
import {
  DistrictCommissionersLicensesService,
  RettindiFyrirIslandIsApi,
} from '@island.is/clients/district-commissioners-licenses'
import { HealthDirectorateClientService } from '@island.is/clients/health-directorate'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { License, OccupationalLicenseStatusV2 } from './models/license.model'
import { isDefined } from '@island.is/shared/utils'
import { MMSApi } from '@island.is/clients/mms'
import { info } from 'kennitala'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import {
  addLicenseTypePrefix,
  mapDistrictCommissionersLicenseStatusToStatus,
} from './utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import {
  LicenseResponse,
  OccupationalLicenseV2LicenseResponseType,
} from './models/licenseResponse.model'
import { LinkType } from './models/link'

export class OccupationalLicensesV2Service {
  constructor(
    private readonly dcService: DistrictCommissionersLicensesService,
    private readonly healthService: HealthDirectorateClientService,
    private readonly mmsApi: MMSApi,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadService: ConfigType<typeof DownloadServiceConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}
  async getDistrictCommissionerLicenses(user: User): Promise<License[] | null> {
    const licenses = await this.dcService.getLicenses(user)

    if (!licenses) {
      return []
    }

    const data: Array<License> =
      licenses
        ?.map((l) => {
          if (!l || !l.status || !l.title || !l.validFrom) {
            return
          }
          return {
            licenseId: addLicenseTypePrefix(l.id, 'DistrictCommissioners'),
            licenseNumber: l.id,
            issuer: l.issuerId,
            issuerTitle: l.issuerTitle,
            profession: l.title,
            permit: l.title,
            dateOfBirth: info(user.nationalId).birthday,
            validFrom: l.validFrom,
            title: l.title,
            status: mapDistrictCommissionersLicenseStatusToStatus(l.status),
          }
        })
        .filter(isDefined) ?? []

    return data
  }
  async getDistrictCommissionerLicenseById(
    user: User,
    id: string,
  ): Promise<LicenseResponse | null> {
    const license = await this.dcService.getLicense(user, id)

    if (!license) {
      return null
    }

    if (!license.licenseInfo) {
      return null
    }

    return {
      type: OccupationalLicenseV2LicenseResponseType.DISTRICT_COMMISSIONERS,
      license: {
        licenseId: addLicenseTypePrefix(
          license.licenseInfo.id,
          'DistrictCommissioners',
        ),
        licenseHolderName: license.holderName,
        licenseNumber: license.licenseInfo.id,
        issuer: license.licenseInfo.issuerId,
        profession: license.licenseInfo.title,
        dateOfBirth: info(user.nationalId).birthday,
        validFrom: license.licenseInfo.validFrom,
        status: mapDistrictCommissionersLicenseStatusToStatus(
          license.licenseInfo.status,
        ),
        title: license.licenseInfo.title,
        genericFields: license.extraFields ?? [],
      },
      actions: license.actions?.map((a) => ({
        type: a.type === 'file' ? LinkType.FILE : LinkType.LINK,
        text: a.title,
        url: a.url,
      })),
      headerText: license.headerText,
      footerText: license.footerText,
    }
  }

  async getHealthDirectorateLicenses(
    @CurrentUser() user: User,
  ): Promise<Array<License> | null> {
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
            case 'REVOKED':
              status = OccupationalLicenseStatusV2.REVOKED
              break
            case 'WAIVED':
              status = OccupationalLicenseStatusV2.WAIVED
              break
            case 'INVALID':
              status = OccupationalLicenseStatusV2.INVALID
              break
            default:
              status = OccupationalLicenseStatusV2.UNKNOWN
          }
          return {
            licenseId: addLicenseTypePrefix(l.licenseNumber, 'Health'),
            licenseNumber: l.licenseNumber,
            legalEntityId: l.legalEntityId,
            issuer: issuer,
            profession: l.profession,
            permit: l.practice,
            licenseHolderName: l.licenseHolderName,
            licenseHolderNationalId: l.licenseHolderNationalId,
            dateOfBirth: info(l.licenseHolderNationalId).birthday,
            validFrom: l.validFrom,
            title: `${l.profession} - ${l.practice}`,
            status,
          }
        })
        .filter(isDefined) ?? []
    )
  }

  async getHealthDirectorateLicenseById(
    @CurrentUser() user: User,
    id: string,
  ): Promise<LicenseResponse | null> {
    const licenses = await this.getHealthDirectorateLicenses(user)

    const license = licenses?.find((l) => l.licenseNumber === id) ?? null
    if (!license) {
      return null
    }

    return {
      license,
      type: OccupationalLicenseV2LicenseResponseType.HEALTH_DIRECTORATE,
    }
  }

  async getEducationLicenses(
    @CurrentUser() user: User,
  ): Promise<License[] | null> {
    const licenses = await this.mmsApi.getLicenses(user.nationalId)

    const issuer: OrganizationSlugType = 'haskoli-islands'

    const data: Array<License> =
      licenses
        .map((l) => {
          return {
            licenseId: addLicenseTypePrefix(l.id, 'Education'),
            licenseNumber: l.id,
            issuer: issuer,
            issuerTitle: l.issuer,
            profession: capitalize(l.type),
            permit: capitalize(l.type),
            licenseHolderName: l.fullName,
            licenseHolderNationalId: l.nationalId,
            dateOfBirth: info(l.nationalId).birthday,
            validFrom: new Date(l.issued),
            title: capitalize(l.type),
            status:
              new Date(l.issued) < new Date()
                ? OccupationalLicenseStatusV2.VALID
                : OccupationalLicenseStatusV2.INVALID,
          }
        })
        .filter(isDefined) ?? []

    return data
  }

  async getEducationLicenseById(
    @CurrentUser() user: User,
    locale: Locale,
    id: string,
  ): Promise<LicenseResponse | null> {
    const licenses = await this.getEducationLicenses(user)

    const license = licenses?.find((l) => l.licenseNumber === id) ?? null

    if (!license) {
      return null
    }

    const text = locale === 'is' ? 'Sækja leyfisbréf' : 'Fetch license'

    return {
      license,
      type: OccupationalLicenseV2LicenseResponseType.EDUCATION,
      actions: [
        {
          type: LinkType.FILE,
          text,
          url: `${this.downloadService.baseUrl}/download/v1/occupational-licenses/education/${license.licenseId}`,
        },
      ],
    }
  }
}

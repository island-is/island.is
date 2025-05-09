import { type Locale } from '@island.is/shared/types'
import { CurrentUser } from '@island.is/auth-nest-tools'
import capitalize from 'lodash/capitalize'
import type { User } from '@island.is/auth-nest-tools'
import { Inject } from '@nestjs/common'
import { DistrictCommissionersLicensesService } from '@island.is/clients/district-commissioners-licenses'
import {
  HealthDirectorateClientService,
  HealthDirectorateLicenseToPractice,
} from '@island.is/clients/health-directorate'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { License } from './models/license.model'
import { isDefined } from '@island.is/shared/utils'
import { MMSApi } from '@island.is/clients/mms'
import { info } from 'kennitala'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import {
  addLicenseTypePrefix,
  mapDistrictCommissionersLicenseStatusToStatus,
} from './utils'
import { LicenseResponse } from './models/licenseResponse.model'
import { LinkType } from './models/link'
import { IntlService } from '@island.is/cms-translations'
import { LicenseType } from './models/licenseType.model'
import { LicenseResponse as MMSLicenseResponse } from '@island.is/clients/mms'
import { Status } from './models/licenseStatus.model'
import { LicenseError } from './models/licenseError.model'
import { FetchError } from '@island.is/clients/middlewares'
import { m } from './messages'

const NAMESPACE_ID = 'api.occupational-licenses'

export class OccupationalLicensesService {
  constructor(
    private readonly dcService: DistrictCommissionersLicensesService,
    private readonly healthService: HealthDirectorateClientService,
    private readonly mmsApi: MMSApi,
    private readonly intlService: IntlService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadService: ConfigType<typeof DownloadServiceConfig>,
  ) {}
  async getDistrictCommissionerLicenses(
    user: User,
  ): Promise<Array<License> | LicenseError | null> {
    const licenses = await this.dcService
      .getLicenses(user)
      .catch((e: Error | FetchError) => {
        return {
          type: LicenseType.DISTRICT_COMMISSIONERS,
          error: JSON.stringify(e),
        }
      })

    if (!licenses) {
      return []
    }

    if (Array.isArray(licenses)) {
      const data: Array<License> =
        licenses
          ?.map((l) => {
            if (!l || !l.status || !l.title || !l.validFrom) {
              return
            }
            return {
              licenseId: addLicenseTypePrefix(
                l.id,
                LicenseType.DISTRICT_COMMISSIONERS,
              ),
              type: LicenseType.DISTRICT_COMMISSIONERS,
              issuer: l.issuerId,
              issuerTitle: l.issuerTitle,
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

    return licenses
  }
  async getDistrictCommissionerLicenseById(
    user: User,
    id: string,
    locale: Locale,
  ): Promise<LicenseResponse | null> {
    const license = await this.dcService.getLicense(user, id, locale)

    if (!license) {
      return null
    }

    if (!license.licenseInfo) {
      return null
    }

    return {
      license: {
        licenseId: addLicenseTypePrefix(
          license.licenseInfo.id,
          LicenseType.DISTRICT_COMMISSIONERS,
        ),
        type: LicenseType.DISTRICT_COMMISSIONERS,
        licenseHolderName: license.holderName,
        issuer: license.licenseInfo.issuerId,
        dateOfBirth: info(user.nationalId).birthday,
        validFrom: license.licenseInfo.validFrom,
        status: mapDistrictCommissionersLicenseStatusToStatus(
          license.licenseInfo.status,
        ),
        title: license.licenseInfo.title,
        genericFields: license.extraFields ?? [],
      },
      actions: license.actions?.map((a) => ({
        type:
          a.type === 'file'
            ? LinkType.FILE
            : a.type === 'document'
            ? LinkType.DOCUMENT
            : LinkType.LINK,
        text: a.title,
        url: a.url,
      })),
      headerText: license.headerText,
      footerText: license.footerText,
    }
  }

  async getHealthDirectorateLicenses(
    @CurrentUser() user: User,
  ): Promise<Array<License> | LicenseError | null> {
    const licenses = await this.healthService
      .getHealthDirectorateLicenseToPractice(user)
      .catch((e: Error | FetchError) => {
        return {
          type: LicenseType.HEALTH_DIRECTORATE,
          error: JSON.stringify(e),
        }
      })

    if (Array.isArray(licenses)) {
      return (
        licenses
          ?.map((l) => this.mapHealthDirectorateLicense(l))
          .filter(isDefined) ?? []
      )
    }

    return licenses
  }

  async getHealthDirectorateLicenseById(
    @CurrentUser() user: User,
    id: string,
  ): Promise<LicenseResponse | null> {
    const licenses =
      await this.healthService.getHealthDirectorateLicenseToPractice(user)

    if (!licenses) {
      return null
    }

    const license = licenses.find((l) => l.id.toString() === id)

    if (!license) {
      return null
    }

    return {
      license: this.mapHealthDirectorateLicense(license),
    }
  }

  async getEducationLicenses(
    @CurrentUser() user: User,
  ): Promise<Array<License> | LicenseError | null> {
    const licenses: Array<MMSLicenseResponse> | LicenseError | null =
      await this.mmsApi
        .getLicenses(user.nationalId)
        .catch((e: Error | FetchError) => {
          return {
            type: LicenseType.EDUCATION,
            error: JSON.stringify(e),
          }
        })

    if (Array.isArray(licenses)) {
      const data: Array<License> =
        licenses.map((l) => this.mapEducationLicense(l)).filter(isDefined) ?? []

      return data
    }

    return licenses
  }

  async getEducationLicenseById(
    @CurrentUser() user: User,
    locale: Locale,
    id: string,
  ): Promise<LicenseResponse | null> {
    const { formatMessage } = await this.intlService.useIntl(
      [NAMESPACE_ID],
      locale,
    )

    const data = await this.mmsApi.getLicenses(user.nationalId)

    if (!data) {
      return null
    }

    const license = data.find((l) => l.id === id)

    if (!license) {
      return null
    }

    return {
      license: this.mapEducationLicense(license),
      actions: [
        {
          type: LinkType.FILE,
          text: formatMessage(m.fetchLicense),
          url: `${this.downloadService.baseUrl}/download/v1/occupational-licenses/education/${license.id}`,
        },
      ],
    }
  }

  mapHealthDirectorateLicense = (
    data: HealthDirectorateLicenseToPractice,
  ): License => {
    let status: Status
    switch (data.status) {
      case 'LIMITED':
        status = Status.LIMITED
        break
      case 'VALID':
        status = Status.VALID
        break
      case 'REVOKED':
        status = Status.REVOKED
        break
      case 'WAIVED':
        status = Status.WAIVED
        break
      case 'INVALID':
        status = Status.INVALID
        break
      default:
        status = Status.UNKNOWN
    }

    const organization: OrganizationSlugType = 'landlaeknir'

    return {
      licenseId: addLicenseTypePrefix(
        data.id.toString(),
        LicenseType.HEALTH_DIRECTORATE,
      ),
      licenseNumber: data.licenseNumber,
      type: LicenseType.HEALTH_DIRECTORATE,
      legalEntityId: data.legalEntityId,
      issuer: organization,
      profession: data.profession,
      permit: data.practice,
      licenseHolderName: data.licenseHolderName,
      licenseHolderNationalId: data.licenseHolderNationalId,
      validFrom: data.validFrom,
      title: `${data.profession} - ${data.practice}`,
      status,
    }
  }

  mapEducationLicense = (data: MMSLicenseResponse) => {
    const issuer: OrganizationSlugType = 'haskoli-islands'
    return {
      licenseId: addLicenseTypePrefix(data.id, LicenseType.EDUCATION),
      type: LicenseType.EDUCATION,
      issuer,
      issuerTitle: data.issuer,
      profession: capitalize(data.type),
      licenseHolderName: data.fullName,
      licenseHolderNationalId: data.nationalId,
      dateOfBirth: info(data.nationalId).birthday,
      validFrom: new Date(data.issued),
      title: capitalize(data.type),
      status:
        new Date(data.issued) < new Date() ? Status.VALID : Status.INVALID,
    }
  }
}

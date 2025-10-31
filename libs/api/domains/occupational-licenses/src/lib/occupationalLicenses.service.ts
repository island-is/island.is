import { type Locale } from '@island.is/shared/types'
import { CurrentUser } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Inject } from '@nestjs/common'
import { DistrictCommissionersLicensesService } from '@island.is/clients/district-commissioners-licenses'
import { HealthDirectorateClientService } from '@island.is/clients/health-directorate'
import { License } from './models/license.model'
import { MMSApi } from '@island.is/clients/mms'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { LicenseResponse } from './models/licenseResponse.model'
import { LinkType } from './models/link'
import { IntlService } from '@island.is/cms-translations'
import { LicenseType } from './models/licenseType.model'
import { LicenseResponse as MMSLicenseResponse } from '@island.is/clients/mms'
import { LicenseError } from './models/licenseError.model'
import { FetchError } from '@island.is/clients/middlewares'
import { m } from './messages'
import {
  mapDistrictCommissionersLicense,
  mapDistrictCommissionersLicensesResponse,
} from './mappers/districtCommissionerLicenseMapper'
import {
  mapHealthDirectorateLicensesResponse,
  mapHealthDirectorateLicense,
} from './mappers/healthDirectorateLicenseMapper'
import {
  mapEducationLicense,
  mapEducationLicensesResponse,
} from './mappers/educationLicenseMapper'

const NAMESPACE_ID = 'api.occupational-licenses'

//TODO: make interfaces for collection and single response
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
    locale: Locale,
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
      return mapDistrictCommissionersLicensesResponse(licenses, user, locale)
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
      license: mapDistrictCommissionersLicense(license, user, locale),
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
    locale: Locale,
  ): Promise<Array<License> | LicenseError | null> {
    const licenses = await this.healthService
      .getHealthDirectorateLicenseToPractice(user, locale)
      .catch((e: Error | FetchError) => {
        return {
          type: LicenseType.HEALTH_DIRECTORATE,
          error: JSON.stringify(e),
        }
      })

    if (Array.isArray(licenses)) {
      return mapHealthDirectorateLicensesResponse(licenses, locale)
    }

    return licenses
  }

  async getHealthDirectorateLicenseById(
    @CurrentUser() user: User,
    id: string,
    locale: Locale,
  ): Promise<LicenseResponse | null> {
    const licenses =
      await this.healthService.getHealthDirectorateLicenseToPractice(
        user,
        locale,
      )

    if (!licenses) {
      return null
    }

    const license = licenses.find((l) => l.id.toString() === id)

    if (!license) {
      return null
    }

    return {
      license: mapHealthDirectorateLicense(license, locale),
    }
  }

  async getEducationLicenses(
    @CurrentUser() user: User,
    locale: Locale,
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
      return mapEducationLicensesResponse(licenses, locale)
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
      license: mapEducationLicense(license, locale),
      actions: [
        {
          type: LinkType.FILE,
          text: formatMessage(m.fetchLicense),
          url: `${this.downloadService.baseUrl}/download/v1/occupational-licenses/education/${license.id}`,
        },
      ],
    }
  }
}

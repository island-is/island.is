import {
  GenericLicenseClient,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
} from '../../licenceService.type'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  FirearmApplicationApi,
  LicenseInfo,
} from '@island.is/clients/firearm-license'
import { User } from '@island.is/auth-nest-tools'
import { Inject } from '@nestjs/common'
import { parseFirearmLicensePayload } from './firearmLicenseMapper'

/** Category to attach each log message to */
const LOG_CATEGORY = 'firearmlicense-service'

export class GenericFirearmLicenseApi
  implements GenericLicenseClient<LicenseInfo> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private firearmApi: FirearmApplicationApi,
  ) {}

  async fetchLicense(user: User) {
    let license: unknown

    try {
      license = await this.firearmApi.apiFirearmApplicationLicenseInfoSsnGet({
        ssn: user.nationalId,
      })
    } catch (e) {
      this.logger.error('Firearm license fetch failed', {
        exception: e,
        message: (e as Error)?.message,
        category: LOG_CATEGORY,
      })
      return null
    }

    return license as LicenseInfo
  }

  async getLicense(user: User): Promise<GenericLicenseUserdataExternal | null> {
    const license = await this.fetchLicense(user)

    if (!license) {
      this.logger.warn('Missing Firearm license, null from api', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const payload = parseFirearmLicensePayload(license)

    return {
      status: GenericUserLicenseStatus.HasLicense,
      payload,
      pkpassStatus: GenericUserLicensePkPassStatus.Unknown,
    }
  }
  async getLicenseDetail(
    user: User,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(user)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPkPassUrl(user: User): Promise<string | null> {
    return null
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPkPassQRCode(user: User): Promise<string | null> {
    return null
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    return null
  }
}

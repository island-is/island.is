import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  GenericLicenseClient,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
} from '../../licenceService.type'
import { GenericAdrLicenseResponse } from './genericAdrLicense.type'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { parseAdrLicensePayload } from './adrLicenseMapper'
import { AdrApi } from '@island.is/clients/adr-and-machine-license'

/** Category to attach each log message to */
const LOG_CATEGORY = 'adrlicense-service'

@Injectable()
export class GenericAdrLicenseApi
  implements GenericLicenseClient<GenericAdrLicenseResponse> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private adrApi: AdrApi,
  ) {}

  async fetchLicense(user: User) {
    let license: unknown

    try {
      license = await this.adrApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getAdr()
    } catch (e) {
      console.log(e)
      this.logger.error('ADR license fetch failed', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    return license as GenericAdrLicenseResponse
  }

  async getLicense(user: User): Promise<GenericLicenseUserdataExternal | null> {
    const license = await this.fetchLicense(user)

    if (!license) {
      this.logger.warn('Missing ADR license, null from api', {
        category: LOG_CATEGORY,
      })
      return null
    }
    const payload = parseAdrLicensePayload(license)

    return {
      status: GenericUserLicenseStatus.HasLicense,
      payload,
      pkpassStatus: GenericUserLicensePkPassStatus.NotAvailable,
    }
  }

  async getLicenseDetail(
    user: User,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(user)
  }
  async getPkPassUrl(user: User): Promise<string | null> {
    return null
  }
  async getPkPassQRCode(user: User): Promise<string | null> {
    return null
  }
  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    return null
  }
}

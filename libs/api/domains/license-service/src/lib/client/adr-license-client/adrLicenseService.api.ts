import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Cache as CacheManager } from 'cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import {
  GenericLicenseClient,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
} from '../../licenceService.type'
import { GenericAdrLicenseResponse } from './genericAdrLicense.type'
import { User } from '@island.is/auth-nest-tools'
import { AdrApi, Configuration } from '@island.is/clients/aosh'
import { parseAdrLicensePayload } from './adrLicenseMapper'

/** Category to attach each log message to */
const LOG_CATEGORY = 'adrlicense-service'

@Injectable()
export class GenericAdrLicenseApi
  implements GenericLicenseClient<GenericAdrLicenseResponse> {
  private readonly adrApi: AdrApi

  constructor(
    private config: Configuration,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private cacheManager?: CacheManager | null,
  ) {
    this.cacheManager = cacheManager
    this.adrApi = new AdrApi(config)
    this.logger = logger
  }

  async fetchLicense(nationalId: string) {
    let license: unknown

    try {
      license = await this.adrApi.getAdr({
        kennitala: nationalId,
      })
      const k = license
    } catch (e) {
      this.logger.error('ADR license fetch failed', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    return license as GenericAdrLicenseResponse
  }

  async getLicense(
    nationalId: User['nationalId'],
  ): Promise<GenericLicenseUserdataExternal | null> {
    const license = await this.fetchLicense(nationalId)

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
    nationalId: User['nationalId'],
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(nationalId)
  }
  async getPkPassUrl(nationalId: User['nationalId']): Promise<string | null> {
    return null
  }
  async getPkPassQRCode(
    nationalId: User['nationalId'],
  ): Promise<string | null> {
    return null
  }
  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    return null
  }
}

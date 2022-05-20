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
import { User } from '@island.is/auth-nest-tools'
import { Configuration, VinnuvelaApi } from '@island.is/clients/aosh'
import { parseMachineLicensePayload } from './machineLicenseMappers'
import { GenericMachineLicenseResponse } from './genericMachineLicense.type'

/** Category to attach each log message to */
const LOG_CATEGORY = 'machinelicense-service'

@Injectable()
export class GenericMachineLicenseApi
  implements GenericLicenseClient<GenericMachineLicenseResponse> {
  private readonly machineApi: VinnuvelaApi
  constructor(
    private config: Configuration,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private cacheManager?: CacheManager | null,
  ) {
    this.cacheManager = cacheManager
    this.machineApi = new VinnuvelaApi(config)
  }

  async fetchLicense(nationalId: string) {
    let license: unknown

    try {
      license = await this.machineApi.getVinnuvela({
        kennitala: nationalId,
      })
    } catch (e) {
      this.logger.error('Machine license fetch failed', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    return license as GenericMachineLicenseResponse
  }

  async getLicense(
    nationalId: User['nationalId'],
  ): Promise<GenericLicenseUserdataExternal | null> {
    const license = await this.fetchLicense(nationalId)

    if (!license) {
      this.logger.warn('Missing machine license, null from api', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const payload = parseMachineLicensePayload(license)

    return {
      status: GenericUserLicenseStatus.HasLicense,
      payload,
      pkpassStatus: GenericUserLicensePkPassStatus.NotAvailable,
    }
  }

  async getLicenseDetail(
    nationalId: string,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(nationalId)
  }
  async getPkPassUrl(nationalId: string): Promise<string | null> {
    return null
  }
  async getPkPassQRCode(nationalId: string): Promise<string | null> {
    return null
  }
  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    return null
  }
}

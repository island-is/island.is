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
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  VinnuvelaApi,
  VinnuvelaDto,
} from '@island.is/clients/adr-and-machine-license'
import { parseMachineLicensePayload } from './machineLicenseMappers'

/** Category to attach each log message to */
const LOG_CATEGORY = 'machinelicense-service'

@Injectable()
export class GenericMachineLicenseApi
  implements GenericLicenseClient<VinnuvelaDto> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private machineApi: VinnuvelaApi,
  ) {}

  async fetchLicense(user: User) {
    let license: unknown

    try {
      license = await this.machineApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getVinnuvela()
    } catch (e) {
      this.logger.error('Machine license fetch failed', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }
    return license as VinnuvelaDto
  }

  async getLicense(user: User): Promise<GenericLicenseUserdataExternal | null> {
    const license = await this.fetchLicense(user)

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

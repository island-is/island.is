import {
  GenericLicenseClient,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
} from '../../licenceService.type'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import {
  createPkPassDataInput,
  parseFirearmLicensePayload,
} from './firearmLicenseMapper'
import { FetchError } from '@island.is/clients/middlewares'
import {
  CreatePkPassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import {
  LicenseInfo,
  FirearmApi,
  LicenseAndPropertyInfo,
} from '@island.is/clients/firearm-license'

/** Category to attach each log message to */
const LOG_CATEGORY = 'firearmlicense-service'
@Injectable()
export class GenericFirearmLicenseApi
  implements GenericLicenseClient<LicenseInfo> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private firearmApi: FirearmApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private handleError(error: Partial<FetchError>): unknown {
    // Not throwing error if service returns 403 or 404. Log information instead.
    if (error.status === 403 || error.status === 404) {
      this.logger.info(`Firearm license returned ${error.status}`, {
        exception: error,
        message: (error as Error)?.message,
        category: LOG_CATEGORY,
      })
      return null
    }
    this.logger.warn('Firearm license fetch failed', {
      exception: error,
      message: (error as Error)?.message,
      category: LOG_CATEGORY,
    })

    return null
  }

  async fetchLicense(user: User) {
    let license: unknown

    try {
      license = await this.firearmApi.getLicenseAndPropertyInfo(user.nationalId)
    } catch (e) {
      this.handleError(e)
    }

    return license as LicenseAndPropertyInfo
  }

  async getLicense(user: User): Promise<GenericLicenseUserdataExternal | null> {
    const license = await this.fetchLicense(user)

    if (!license) {
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
  async getPkPassUrl(user: User): Promise<string | null> {
    const license = await this.fetchLicense(user)
    const inputValues = createPkPassDataInput(license, user.nationalId)

    if (!inputValues) return null
    //Fetch template from api?
    const payload: CreatePkPassDataInput = {
      passTemplateId: '61f74977-0e81-4786-94df-6b8470013f09',
      inputFieldValues: inputValues,
      thumbnail: {
        imageBase64String: license.licenseImgBase64 ?? '',
      },
    }

    const pass = await this.smartApi.generatePkPassUrl(payload)
    return pass ?? null
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPkPassQRCode(user: User): Promise<string | null> {
    const license = await this.fetchLicense(user)
    const inputValues = createPkPassDataInput(license, user.nationalId)

    if (!inputValues) return null
    //Fetch template from api?
    const payload: CreatePkPassDataInput = {
      passTemplateId: '61f74977-0e81-4786-94df-6b8470013f09',
      inputFieldValues: inputValues,
      thumbnail: {
        imageBase64String: license.licenseImgBase64 ?? '',
      },
    }
    const pass = await this.smartApi.generatePkPassQrCode(payload)
    return pass ?? null
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    return null
  }
}

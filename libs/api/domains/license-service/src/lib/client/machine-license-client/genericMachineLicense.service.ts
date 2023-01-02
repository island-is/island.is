import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  GenericLicenseClient,
  GenericLicenseLabels,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
  PkPassVerificationInputData,
} from '../../licenceService.type'
import { User } from '@island.is/auth-nest-tools'
import {
  MachineLicenseService,
  VinnuvelaDto,
} from '@island.is/clients/adr-and-machine-license'
import {
  createPkPassDataInput,
  parseMachineLicensePayload,
} from './machineLicenseMapper'
import {
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { format } from 'kennitala'
import { Locale } from 'locale'

/** Category to attach each log message to */
const LOG_CATEGORY = 'machinelicense-service'

@Injectable()
export class GenericMachineLicenseService
  implements GenericLicenseClient<VinnuvelaDto> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private machineApi: MachineLicenseService,
    private smartApi: SmartSolutionsApi,
  ) {}

  async fetchLicense(user: User) {
    const license = await this.machineApi.getLicenseInfo(user)
    return license
  }

  async getLicense(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    const licenseData = await this.fetchLicense(user)

    if (!licenseData.ok) {
      this.logger.info('received an invalid response from service', {
        status: licenseData.error.code,
        statusText: licenseData.error.message,
        category: LOG_CATEGORY,
      })
      return {
        status: GenericUserLicenseStatus.Unknown,
        pkpassStatus: GenericUserLicensePkPassStatus.Unknown,
        error: {
          status: licenseData.error.code,
          message: licenseData.error.message ?? 'Unknown',
          data: licenseData.error.data,
        },
      }
    }

    //Response was ok, but did the service return a license?
    if (!licenseData.data) {
      return {
        status: GenericUserLicenseStatus.NotAvailable,
        pkpassStatus: GenericUserLicensePkPassStatus.NotAvailable,
        payload: null,
      }
    }

    const payload = parseMachineLicensePayload(licenseData.data, locale, labels)

    if (payload) {
      return {
        status: GenericUserLicenseStatus.HasLicense,
        payload,
        pkpassStatus: GenericUserLicensePkPassStatus.Available,
      }
    }

    return {
      status: GenericUserLicenseStatus.NotAvailable,
      payload,
      pkpassStatus: GenericUserLicensePkPassStatus.NotAvailable,
    }
  }

  async getLicenseDetail(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(user, locale, labels)
  }

  private async createPkPassPayload(
    user: User,
    locale: Locale,
  ): Promise<PassDataInput | null> {
    const license = await this.fetchLicense(user)

    if (!license.ok || !license.data) {
      return null
    }

    const inputValues = createPkPassDataInput(
      license.data,
      user.nationalId,
      locale,
    )
    if (!inputValues) return null
    //Fetch template from api?
    return {
      inputFieldValues: inputValues,
    }
  }

  async getPkPassUrl(
    user: User,
    data?: unknown,
    locale?: Locale,
  ): Promise<string | null> {
    //TODO: Better locale handling thank u
    const payload = await this.createPkPassPayload(user, locale ?? 'is')

    if (!payload) {
      return null
    }

    const pass = await this.smartApi.generatePkPassUrl(
      payload,
      format(user.nationalId),
    )
    if (pass.ok) {
      return pass.data
    }

    //time to do some wicked error handling
    return null
  }
  async getPkPassQRCode(
    user: User,
    data?: unknown,
    locale?: Locale,
  ): Promise<string | null> {
    const payload = await this.createPkPassPayload(user, locale ?? 'is')

    if (!payload) {
      return null
    }

    const pass = await this.smartApi.generatePkPassQrCode(
      payload,
      format(user.nationalId),
    )
    if (pass.ok) {
      return pass.data
    }

    //time to do some wicked error handling
    return null
  }
  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    const { code, date } = JSON.parse(data) as PkPassVerificationInputData
    const result = await this.smartApi.verifyPkPass({ code, date })

    if (!result) {
      this.logger.warn('Missing pkpass verify from client', {
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!result.ok) {
      return {
        valid: false,
        data: undefined,
        error: {
          status: result.error.code.toString(),
          message: result.error.message ?? '',
          data: result.error.data,
        },
      }
    }

    /*
      TODO: VERIFICATION!!!!!!!! Máni (thorkellmani @ github)
      Currently Impossible
      A robust verification needs to both check that the PkPass is valid,
      and that the user being scanned does indeed have a license!.
      This method currently checks the validity of the PkPass, but we can't
      inspect the validity of their actual ADR license. As of now, we can
      only retrieve the license of a logged in user, not the user being scanned!
    */

    return {
      valid: result.data.valid,
    }
  }
}

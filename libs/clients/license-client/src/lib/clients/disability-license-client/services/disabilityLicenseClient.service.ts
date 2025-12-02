import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { createPkPassDataInput } from '../disabilityLicenseMapper'
import {
  DisabilityLicenseService,
  OrorkuSkirteini,
} from '@island.is/clients/disability-license'
import {
  Pass,
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { FetchError } from '@island.is/clients/middlewares'
import compareAsc from 'date-fns/compareAsc'
import {
  LicenseClient,
  LicensePkPassAvailability,
  LicenseType,
  PkPassVerificationInputData,
  Result,
  VerifyPkPassResult,
} from '../../../licenseClient.type'
import { GeneralLicenseVerifyExtraData } from '../../base'

/** Category to attach each log message to */
const LOG_CATEGORY = 'disability-license-service'

@Injectable()
export class DisabilityLicenseClient
  implements LicenseClient<LicenseType.DisabilityLicense>
{
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private disabilityLicenseApi: DisabilityLicenseService,
    private smartApi: SmartSolutionsApi,
  ) {}

  clientSupportsPkPass = true
  type = LicenseType.DisabilityLicense

  private checkLicenseValidityForPkPass(
    licenseInfo: OrorkuSkirteini,
  ): LicensePkPassAvailability {
    if (!licenseInfo || !licenseInfo.gildirtil) {
      return LicensePkPassAvailability.Unknown
    }

    const expired = new Date(licenseInfo.gildirtil)
    const comparison = compareAsc(expired, new Date())

    if (isNaN(comparison) || comparison < 0) {
      return LicensePkPassAvailability.NotAvailable
    }

    return LicensePkPassAvailability.Available
  }

  private async fetchLicense(
    user: User,
  ): Promise<Result<OrorkuSkirteini | null>> {
    try {
      const licenseInfo = await this.disabilityLicenseApi.getDisabilityLicense(
        user,
      )
      return { ok: true, data: licenseInfo }
    } catch (e) {
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        error = {
          code: 13,
          message: 'Service failure',
          data: JSON.stringify(e.body),
        }
      } else {
        const unknownError = e as Error
        error = {
          code: 99,
          message: 'Unknown error',
          data: JSON.stringify(unknownError),
        }
      }

      return {
        ok: false,
        error,
      }
    }
  }

  licenseIsValidForPkPass(
    payload: unknown,
  ): Promise<LicensePkPassAvailability> {
    if (typeof payload === 'string') {
      let jsonLicense: OrorkuSkirteini
      try {
        jsonLicense = JSON.parse(payload)
      } catch (e) {
        this.logger.warn('Invalid raw data', { error: e, LOG_CATEGORY })
        return Promise.resolve(LicensePkPassAvailability.Unknown)
      }
      return Promise.resolve(this.checkLicenseValidityForPkPass(jsonLicense))
    }

    return Promise.resolve(
      this.checkLicenseValidityForPkPass(payload as OrorkuSkirteini),
    )
  }

  async getLicenses(user: User): Promise<Result<Array<OrorkuSkirteini>>> {
    const licenseData = await this.fetchLicense(user)
    if (!licenseData.ok) {
      return licenseData
    }

    if (!licenseData.data) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'No license data returned',
        },
      }
    }

    const isEmpty = Object.values(licenseData.data).every((item) =>
      item ? false : true,
    )

    const data = isEmpty ? null : licenseData.data

    return {
      ok: true,
      data: data ? [data] : [],
    }
  }

  private async createPkPassPayload(
    data: OrorkuSkirteini,
  ): Promise<PassDataInput | null> {
    const inputValues = createPkPassDataInput(data)
    if (!inputValues) return null
    return {
      inputFieldValues: inputValues,
      expirationDate: data.rennurut?.toISOString(),
    }
  }

  async getPkPass(user: User): Promise<Result<Pass>> {
    const license = await this.fetchLicense(user)

    if (!license.ok || !license.data) {
      this.logger.info(
        `No license data found for user, no pkpass payload to create`,
        { category: LOG_CATEGORY },
      )
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No disability license data found',
        },
      }
    }
    const payload = await this.createPkPassPayload(license.data)

    if (!payload) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Missing payload',
        },
      }
    }

    return this.smartApi.generatePkPass(payload)
  }

  async getPkPassQRCode(user: User): Promise<Result<string>> {
    const res = await this.getPkPass(user)

    if (!res.ok) {
      return res
    }

    if (!res.data.distributionQRCode) {
      const error = {
        code: 13,
        message: 'Missing pkpass distribution QR code in disability license',
      }

      this.logger.warn(error.message, {
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error,
      }
    }

    return {
      ok: true,
      data: res.data.distributionQRCode,
    }
  }

  async getPkPassUrl(user: User): Promise<Result<string>> {
    const res = await this.getPkPass(user)

    if (!res.ok) {
      return res
    }

    if (!res.data.distributionUrl) {
      const error = {
        code: 13,
        message: 'Missing pkpass distribution url in disability license',
      }

      this.logger.warn(error.message, {
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error,
      }
    }

    return {
      ok: true,
      data: res.data.distributionUrl,
    }
  }

  async verifyPkPass(
    data: string,
  ): Promise<Result<VerifyPkPassResult<LicenseType.DisabilityLicense>>> {
    const { code, date } = JSON.parse(data) as PkPassVerificationInputData
    const result = await this.smartApi.verifyPkPass({ code, date })

    if (!result.ok) {
      return result
    }

    /*
      Todo when possible:
      Currently impossible to verify whether a user has an actual license
      with the relevant organization. We only verify the user has a PkPass
    */

    return {
      ok: true,
      data: {
        valid: result.data.valid,
      },
    }
  }

  async verifyExtraData(user: User): Promise<GeneralLicenseVerifyExtraData> {
    const license = await this.fetchLicense(user)
    if (!license.ok || !license.data) {
      throw new Error('No license found')
    }

    if (!license.data.nafn) {
      throw new Error('No name found')
    }

    return {
      nationalId: license.data.kennitala ?? '',
      name: license.data.nafn,
    }
  }
}

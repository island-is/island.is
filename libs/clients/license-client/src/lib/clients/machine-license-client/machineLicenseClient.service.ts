import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  VinnuvelaApi,
  VinnuvelaDto,
} from '@island.is/clients/adr-and-machine-license'
import { FetchError } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Locale } from '@island.is/shared/types'
import { Inject, Injectable } from '@nestjs/common'
import compareAsc from 'date-fns/compareAsc'
import { PkPassService } from '../../helpers/pk-pass-service/pkPass.service'
import {
  LicenseClient,
  LicensePkPassAvailability,
  LicenseType,
  PassData,
  PassDataInput,
  PkPassVerificationInputData,
  Result,
  VerifyPkPassResult,
} from '../../licenseClient.type'
import {
  createPkPassDataInput,
  findLatestExpirationDate,
} from './machineLicenseMapper'
import { GeneralLicenseVerifyExtraData } from '../base'

/** Category to attach each log message to */
const LOG_CATEGORY = 'machinelicense-service'

@Injectable()
export class MachineLicenseClient
  implements LicenseClient<LicenseType.MachineLicense>
{
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private machineApi: VinnuvelaApi,
    private passService: PkPassService,
  ) {}

  clientSupportsPkPass = true
  type = LicenseType.MachineLicense

  private checkLicenseValidityForPkPass(
    licenseInfo: VinnuvelaDto,
  ): LicensePkPassAvailability {
    const expirationDate = licenseInfo
      ? findLatestExpirationDate(licenseInfo)
      : null

    if (!licenseInfo || !expirationDate) {
      return LicensePkPassAvailability.Unknown
    }

    const comparison = compareAsc(new Date(expirationDate), new Date())

    if (Number.isNaN(comparison) || comparison < 0) {
      return LicensePkPassAvailability.NotAvailable
    }

    return LicensePkPassAvailability.Available
  }

  private async fetchLicense(user: User): Promise<Result<VinnuvelaDto | null>> {
    try {
      const licenseInfo = await this.machineApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getVinnuvela()
      return { ok: true, data: licenseInfo }
    } catch (e) {
      //404 - no license for user, still ok!
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        if (e.status === 404) {
          return { ok: true, data: null }
        } else {
          error = {
            code: 13,
            message: 'Service failure',
            data: JSON.stringify(e.body),
          }
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
      let jsonLicense: VinnuvelaDto
      try {
        jsonLicense = JSON.parse(payload)
      } catch (e) {
        this.logger.warn('Invalid raw data', { error: e, LOG_CATEGORY })
        return Promise.resolve(LicensePkPassAvailability.Unknown)
      }
      return Promise.resolve(this.checkLicenseValidityForPkPass(jsonLicense))
    }
    return Promise.resolve(
      this.checkLicenseValidityForPkPass(payload as VinnuvelaDto),
    )
  }

  async getLicenses(user: User): Promise<Result<Array<VinnuvelaDto>>> {
    const licenseData = await this.fetchLicense(user)

    if (licenseData.ok) {
      return {
        ok: true,
        data: licenseData.data ? [licenseData.data] : [],
      }
    }

    return licenseData
  }

  private async createPkPassPayload(
    user: User,
    locale: Locale,
  ): Promise<PassDataInput | null> {
    const license = await this.fetchLicense(user)
    if (!license.ok || !license.data) {
      this.logger.info(
        `No license data found for user, no pkpass payload to create`,
        { category: LOG_CATEGORY },
      )
      return null
    }

    const inputValues = createPkPassDataInput(
      license.data,
      user.nationalId,
      locale,
    )
    if (!inputValues) return null
    return {
      inputFieldValues: inputValues,
      expirationDate: findLatestExpirationDate(license.data) ?? undefined,
    }
  }

  async getPkPass(
    user: User,
    locale: Locale = 'is',
    version?: 'v1' | 'v2',
  ): Promise<Result<PassData>> {
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
          message: 'No machine license data found',
        },
      }
    }

    const valid = await this.licenseIsValidForPkPass(license.data)

    if (!valid) {
      return {
        ok: false,
        error: {
          code: 5,
          message: 'Pass is invalid for pkpass generation',
        },
      }
    }
    const payload = await this.createPkPassPayload(user, locale)

    if (!payload) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Missing payload',
        },
      }
    }

    const pass = await this.passService.generatePkPass(
      payload,
      undefined,
      undefined,
      version,
    )

    return pass
  }

  async getPkPassQRCode(
    user: User,
    locale?: Locale,
    version?: 'v1' | 'v2',
  ): Promise<Result<string>> {
    const res = await this.getPkPass(user, locale, version)

    if (!res.ok) {
      return res
    }

    if (!res.data.distributionQRCode) {
      const error = {
        code: 13,
        message: 'Missing pkpass distribution QR code in machine license',
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

  async getPkPassUrl(
    user: User,
    locale?: Locale,
    version?: 'v1' | 'v2',
  ): Promise<Result<string>> {
    const res = await this.getPkPass(user, locale, version)

    if (!res.ok) {
      return res
    }

    if (!res.data.distributionUrl) {
      const error = {
        code: 13,
        message: 'Missing pkpass distribution url in machine license',
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
    version?: 'v1' | 'v2',
  ): Promise<Result<VerifyPkPassResult<LicenseType.MachineLicense>>> {
    const { code, date } = JSON.parse(data) as PkPassVerificationInputData
    const result = await this.passService.verifyPkPass(
      { code, date },
      undefined,
      version,
    )

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
    if (!license.data.fulltNafn) {
      throw new Error('No name found')
    }

    return {
      nationalId: license.data.kennitala ?? '',
      name: license.data.fulltNafn,
    }
  }
}

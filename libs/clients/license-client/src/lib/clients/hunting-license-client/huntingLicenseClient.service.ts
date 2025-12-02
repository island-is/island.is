import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { createPkPassDataInput } from './huntingLicenseClientMapper'
import {
  Pass,
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { FetchError } from '@island.is/clients/middlewares'
import {
  LicenseClient,
  LicensePkPassAvailability,
  LicenseType,
  PkPassVerificationInputData,
  Result,
  VerifyPkPassResult,
} from '../../licenseClient.type'
import { NvsPermitsClientService } from '@island.is/clients/nvs-permits'
import { mapHuntingLicenseDto } from './mapper'
import { HuntingLicenseDto } from './types'

/** Category to attach each log message to */
const LOG_CATEGORY = 'hunting-license-service'

@Injectable()
export class HuntingLicenseClient
  implements LicenseClient<LicenseType.HuntingLicense>
{
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private huntingService: NvsPermitsClientService,
    private smartApi: SmartSolutionsApi,
  ) {}

  clientSupportsPkPass = true
  type = LicenseType.HuntingLicense

  private checkLicenseValidityForPkPass(
    licenseInfo: HuntingLicenseDto,
  ): LicensePkPassAvailability {
    if (!licenseInfo || !licenseInfo.isValid) {
      return LicensePkPassAvailability.Unknown
    }

    return LicensePkPassAvailability.Available
  }

  private async fetchLicense(
    user: User,
  ): Promise<Result<HuntingLicenseDto | null>> {
    try {
      const licenseInfo = await this.huntingService.getHuntingPermits(user)
      return { ok: true, data: mapHuntingLicenseDto(licenseInfo ?? undefined) }
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
      let jsonLicense: HuntingLicenseDto
      try {
        jsonLicense = JSON.parse(payload)
      } catch (e) {
        this.logger.warn('Invalid raw data', { error: e, LOG_CATEGORY })
        return Promise.resolve(LicensePkPassAvailability.Unknown)
      }
      return Promise.resolve(this.checkLicenseValidityForPkPass(jsonLicense))
    }
    return Promise.resolve(
      this.checkLicenseValidityForPkPass(payload as HuntingLicenseDto),
    )
  }

  async getLicenses(user: User): Promise<Result<Array<HuntingLicenseDto>>> {
    const licenseData = await this.fetchLicense(user)

    if (!licenseData.ok) {
      return licenseData
    }

    if (licenseData.data === null) {
      //user doesn't have a license
      return {
        ok: true,
        data: [],
      }
    }

    return {
      ok: true,
      data: [licenseData.data],
    }
  }

  private async createPkPassPayload(
    data: HuntingLicenseDto,
  ): Promise<PassDataInput | null> {
    const inputValues = createPkPassDataInput(data)

    if (!inputValues) return null
    //Fetch template from api?
    return {
      inputFieldValues: inputValues,
      expirationDate: data.validTo?.toISOString(),
      thumbnail: data.holderPhoto
        ? {
            imageBase64String: data.holderPhoto ?? '',
          }
        : null,
    }
  }

  private async getPkPass(user: User): Promise<Result<Pass>> {
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
          message: 'No hunting license data found',
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
        message: 'Missing pkpass distribution qr code in hunting license',
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
        message: 'Missing pkpass distribution url in hunting license',
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
  ): Promise<Result<VerifyPkPassResult<LicenseType.HuntingLicense>>> {
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
      data: result.data,
    }
  }
}

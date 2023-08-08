import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import { format as formatNationalId } from 'kennitala'
import {
  DriversLicense,
  DrivingLicenseApi,
} from '@island.is/clients/driving-license'
import {
  LicenseClient,
  LicensePkPassAvailability,
  PkPassVerification,
  PkPassVerificationInputData,
  Result,
} from '../../../licenseClient.type'
import {
  Pass,
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { createPkPassDataInput } from '../drivingLicenseMapper'
/** Category to attach each log message to */
const LOG_CATEGORY = 'drivinglicense-service'

@Injectable()
export class DrivingLicenseClient implements LicenseClient<DriversLicense> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private drivingApi: DrivingLicenseApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private checkLicenseValidity(
    license: DriversLicense,
  ): LicensePkPassAvailability {
    if (
      !license // || license.photo === undefined
    ) {
      return LicensePkPassAvailability.Unknown
    }

    /*
    if (!license.photo?.noted || !license.photo?.image) {
      return LicensePkPassAvailability.NotAvailable
    }
    */

    return LicensePkPassAvailability.Available
  }

  licenseIsValidForPkPass(payload: unknown): LicensePkPassAvailability {
    return this.checkLicenseValidity(payload as DriversLicense)
  }

  private async fetchLicense(
    user: User,
  ): Promise<Result<DriversLicense | null>> {
    try {
      const licenseInfo = await this.drivingApi.getCurrentLicense({
        nationalId: user.nationalId,
      })
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
        this.logger.warn('Expected 200 status', {
          status: e.status,
          statusText: e.statusText,
          category: LOG_CATEGORY,
        })
      } else {
        const unknownError = e as Error
        error = {
          code: 99,
          message: 'Unknown error',
          data: JSON.stringify(unknownError),
        }
        this.logger.warn('Unable to query data', {
          status: e.status,
          statusText: e.statusText,
          category: LOG_CATEGORY,
        })
      }

      return {
        ok: false,
        error,
      }
    }
  }

  private async createPkPassPayload(
    data: DriversLicense,
    nationalId: string,
  ): Promise<PassDataInput | null> {
    const inputValues = createPkPassDataInput(data, nationalId)

    //slice out headers from base64 image string
    //const image = data.photo?.image
    const image = undefined

    if (!inputValues) return null
    //Fetch template from api?
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      expirationDate: data.expires?.toISOString(),
      thumbnail: image
        ? {
            imageBase64String: image ?? '',
          }
        : null,
    }
    return payload
  }

  async getLicense(user: User): Promise<Result<DriversLicense | null>> {
    const licenseData = await this.fetchLicense(user)
    if (!licenseData.ok) {
      this.logger.info(`Drivers license data fetch failed`)
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Service error',
        },
      }
    }

    //the user ain't got no license
    if (!licenseData.data) {
      return {
        ok: true,
        data: null,
      }
    }

    return licenseData
  }

  async getLicenseDetail(user: User): Promise<Result<DriversLicense | null>> {
    return this.getLicense(user)
  }

  async getPkPass(user: User): Promise<Result<Pass>> {
    const license = await this.fetchLicense(user)

    if (!license.ok || !license.data) {
      this.logger.info(
        `No license data found for user, no pkpass payload to create`,
        { LOG_CATEGORY },
      )
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No drivers license data found',
        },
      }
    }

    const valid = this.licenseIsValidForPkPass(license.data)

    if (!valid) {
      return {
        ok: false,
        error: {
          code: 5,
          message: 'Pass is invalid for pkpass generation',
        },
      }
    }

    const payload = await this.createPkPassPayload(
      license.data,
      user.nationalId,
    )

    if (!payload) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Missing payload',
        },
      }
    }

    const pass = await this.smartApi.generatePkPass(
      payload,
      formatNationalId(user.nationalId),
    )

    return pass
  }

  async getPkPassQRCode(user: User): Promise<Result<string>> {
    const res = await this.getPkPass(user)

    if (!res.ok) {
      return res
    }

    if (!res.data.distributionQRCode) {
      const error = {
        code: 13,
        message: 'Missing pkpass distribution QR code in driving license',
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
        message: 'Missing pkpass distribution url in driving license',
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

  async verifyPkPass(data: string): Promise<Result<PkPassVerification>> {
    const { code, date } = JSON.parse(data) as PkPassVerificationInputData
    const result = await this.smartApi.verifyPkPass({ code, date })

    if (!result.ok) {
      return result
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
      ok: true,
      data: result.data,
    }
  }
}

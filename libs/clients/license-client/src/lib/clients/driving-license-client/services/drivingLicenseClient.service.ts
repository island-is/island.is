import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import { format, format as formatNationalId } from 'kennitala'
import {
  DriverLicenseDto,
  DriversLicense,
  DrivingLicenseApi,
  RemarkCode,
} from '@island.is/clients/driving-license'
import {
  LicenseClient,
  LicensePkPassAvailability,
  PkPassVerification,
  PkPassVerificationInputData,
  Result,
  ServiceError,
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
export class DrivingLicenseClient implements LicenseClient<DriverLicenseDto> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private drivingApi: DrivingLicenseApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private checkLicenseValidity(
    license: DriverLicenseDto,
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
    return this.checkLicenseValidity(payload as DriverLicenseDto)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseError(e: any): ServiceError {
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
    return error
  }

  private createPkPassPayload(
    data: DriverLicenseDto,
    codes: Array<RemarkCode>,
  ): PassDataInput | null {
    const inputValues = createPkPassDataInput(data, codes)

    if (!inputValues) {
      this.logger.warn('PkPassDataInput creation failed', {
        category: LOG_CATEGORY,
      })
      return null
    }

    //slice out headers from base64 image string
    const image = data?.photo?.image

    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      expirationDate: data?.dateValidTo?.toISOString(),
      thumbnail: image
        ? {
            imageBase64String: image.substring(image.indexOf(',') + 1).trim(),
          }
        : null,
    }

    return payload
  }

  async getLicense(user: User): Promise<Result<DriverLicenseDto | null>> {
    let licenseData
    try {
      licenseData = await this.drivingApi.getCurrentLicenseV5({
        nationalId: user.nationalId,
        token: user.authorization.replace(/^bearer /i, ''),
      })
    } catch (e) {
      this.logger.warning(`Drivers license data fetch failed`)
      const error = this.parseError(e)
      return {
        ok: false,
        error,
      }
    }

    return {
      ok: true,
      data: licenseData,
    }
  }

  async getLicenseDetail(user: User): Promise<Result<DriverLicenseDto | null>> {
    return this.getLicense(user)
  }

  async getPkPass(user: User): Promise<Result<Pass>> {
    let licenseData
    try {
      licenseData = await Promise.all([
        this.drivingApi.getCurrentLicenseV5({
          nationalId: user.nationalId,
          token: user.authorization.replace(/^bearer /i, ''),
        }),
        this.drivingApi.getRemarksCodeTable(),
      ])
    } catch (e) {
      this.logger.warning(`Drivers license data or category fetch failed`)
      const error = this.parseError(e)
      return {
        ok: false,
        error,
      }
    }

    if (!licenseData[0]) {
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

    if (!licenseData[1]) {
      this.logger.error('No remark codes found', { LOG_CATEGORY })
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No remark codes found',
        },
      }
    }

    const valid = this.licenseIsValidForPkPass(licenseData[0])

    if (!valid) {
      return {
        ok: false,
        error: {
          code: 5,
          message: 'Pass is invalid for pkpass generation',
        },
      }
    }

    const payload = this.createPkPassPayload(licenseData[0], licenseData[1])

    if (!payload) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Payload creation failed',
        },
      }
    }
    const result = await this.smartApi.generatePkPass(
      payload,
      format(user.nationalId),
      () =>
        this.drivingApi.notifyOnPkPassCreation({
          nationalId: user.nationalId,
          token: user.authorization.replace(/^bearer /i, ''),
        }),
    )

    if (!result.ok) {
      this.logger.warn('PkPass creation failed', {
        category: LOG_CATEGORY,
        ...result.error,
      })
    }

    return result
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

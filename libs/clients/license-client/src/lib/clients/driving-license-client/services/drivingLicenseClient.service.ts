import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import { format } from 'kennitala'
import {
  DriverLicenseDto as DriversLicense,
  DrivingLicenseApi,
  RemarkCode,
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
    if (!license || license.photo === undefined) {
      return LicensePkPassAvailability.Unknown
    }

    if (!license.photo.image) {
      return LicensePkPassAvailability.NotAvailable
    }

    return LicensePkPassAvailability.Available
  }

  licenseIsValidForPkPass(payload: unknown): LicensePkPassAvailability {
    return this.checkLicenseValidity(payload as DriversLicense)
  }

  private fetchCategories = () => this.drivingApi.getRemarksCodeTable()

  private async fetchLicense(
    user: User,
  ): Promise<Result<DriversLicense | null>> {
    try {
      const licenseInfo = await this.drivingApi.getCurrentLicenseV5({
        nationalId: user.nationalId,
        token: user.authorization.replace(/^bearer /i, ''),
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
    license: DriversLicense,
    remarks?: Array<RemarkCode>,
  ): Promise<PassDataInput | null> {
    const inputValues = createPkPassDataInput(license, remarks)

    if (!inputValues) {
      this.logger.warn('PkPassDataInput creation failed', {
        category: LOG_CATEGORY,
      })
      return null
    }

    //slice out headers from base64 image string
    const image = license.photo?.image

    if (!inputValues) return null
    //Fetch template from api?
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      expirationDate: license.dateValidTo?.toISOString(),
      thumbnail: image
        ? {
            imageBase64String: image.substring(image.indexOf(',') + 1).trim(),
          }
        : null,
    }

    return payload
  }

  async getLicense(user: User): Promise<Result<DriversLicense | null>> {
    const licenseResponse = await this.fetchLicense(user)
    if (!licenseResponse.ok) {
      this.logger.debug(`Drivers license data fetch failed`, {
        category: LOG_CATEGORY,
      })
      return licenseResponse
    }

    //the user ain't got no license
    if (!licenseResponse.data) {
      return {
        ok: true,
        data: null,
      }
    }

    return licenseResponse
  }

  async getLicenseDetail(user: User): Promise<Result<DriversLicense | null>> {
    return this.getLicense(user)
  }

  async getPkPass(user: User): Promise<Result<Pass>> {
    const license = await Promise.all([
      this.fetchLicense(user),
      this.fetchCategories(),
    ])

    if (!license) {
      this.logger.warn('License data fetch failed', {
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error: {
          code: 13,
          message: 'License fetch failed',
        },
      }
    }

    if (!license[0].ok || !license[0].data) {
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

    const valid = this.licenseIsValidForPkPass(license[0].data)

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
      license[0].data,
      license[1] ?? [],
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

    const pass = await this.smartApi.generatePkPass(payload, () =>
      this.drivingApi.notifyOnPkPassCreation({
        nationalId: user.nationalId,
        token: user.authorization.replace(/^bearer /i, ''),
      }),
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
    const parsedInput = JSON.parse(data)

    const { code, date } = parsedInput as PkPassVerificationInputData

    const result = await this.smartApi.verifyPkPass({ code, date })

    if (!result) {
      this.logger.warn('Missing pkpass verify from client', {
        category: LOG_CATEGORY,
      })
      return result
    }

    if (!result.ok) {
      this.logger.warn('Pkpass verification failed', {
        ...result.error,
        category: LOG_CATEGORY,
      })

      throw new BadRequestException(result.error.message)
    }

    const nationalIdFromPkPass = result.data.pass?.inputFieldValues
      .find((i) => i.passInputField.identifier === 'kennitala')
      ?.value?.replace('-', '')

    if (!nationalIdFromPkPass) {
      throw new BadRequestException('Invalid Pkpass, missing national id')
    }

    const license = await this.drivingApi.getCurrentLicenseV4({
      nationalId: nationalIdFromPkPass,
    })
    // and then compare to verify that the licenses sync up if (!license) {

    if (!license) {
      this.logger.warn('No license found for pkpass national id', {
        category: LOG_CATEGORY,
      })
      throw new BadRequestException('No license found for pkass national id')
    }

    const licenseNationalId = license?.socialSecurityNumber
    const name = license?.name
    const photo = license?.photo?.image ?? ''

    const rawData = license ? JSON.stringify(license) : undefined

    return {
      ok: true,
      data: {
        valid: result.data.valid,
        data: JSON.stringify({
          nationalId: licenseNationalId,
          name,
          photo,
          rawData,
        }),
      },
    }
  }
}

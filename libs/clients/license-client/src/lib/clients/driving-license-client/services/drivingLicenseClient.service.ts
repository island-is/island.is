import { User } from '@island.is/auth-nest-tools'
import {
  DriverLicenseDto as DriversLicense,
  DrivingLicenseApi,
  RemarkCode,
} from '@island.is/clients/driving-license'
import { FetchError } from '@island.is/clients/middlewares'
import {
  Pass,
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import {
  LicenseClient,
  LicensePkPassAvailability,
  LicenseType,
  PkPassVerificationInputData,
  VerifyPkPassResult,
  Result,
} from '../../../licenseClient.type'
import { DrivingLicenseVerifyExtraData } from '../drivingLicenseClient.type'
import { createPkPassDataInput } from '../drivingLicenseMapper'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

/** Category to attach each log message to */
const LOG_CATEGORY = 'drivinglicense-service'

@Injectable()
export class DrivingLicenseClient
  implements LicenseClient<LicenseType.DrivingLicense>
{
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private drivingApi: DrivingLicenseApi,
    private smartApi: SmartSolutionsApi,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  clientSupportsPkPass = true
  type = LicenseType.DrivingLicense

  private async checkLicenseValidity(
    license: DriversLicense,
    user?: User,
  ): Promise<LicensePkPassAvailability> {
    const photoCheckDisabled = user
      ? await this.featureFlagService.getValue(
          Features.licenseServiceDrivingLicencePhotoCheckDisabled,
          false,
          user,
        )
      : false

    if (!license || (!photoCheckDisabled && !license.photo)) {
      return LicensePkPassAvailability.Unknown
    }

    if (photoCheckDisabled || license.photo?.image)
      return LicensePkPassAvailability.Available

    return LicensePkPassAvailability.NotAvailable
  }

  licenseIsValidForPkPass(
    payload: unknown,
    user?: User,
  ): Promise<LicensePkPassAvailability> {
    if (typeof payload === 'string') {
      let jsonLicense: DriversLicense
      try {
        jsonLicense = JSON.parse(payload)
      } catch (e) {
        this.logger.warn('Invalid raw data', { error: e, LOG_CATEGORY })
        return Promise.resolve(LicensePkPassAvailability.Unknown)
      }
      return this.checkLicenseValidity(jsonLicense, user)
    }
    return this.checkLicenseValidity(payload as DriversLicense, user)
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

  async getLicenses(user: User): Promise<Result<Array<DriversLicense>>> {
    const licenseResponse = await this.fetchLicense(user)
    if (!licenseResponse.ok) {
      return licenseResponse
    }

    return {
      ok: true,
      data: licenseResponse.data ? [licenseResponse.data] : [],
    }
  }

  async getPkPass(user: User): Promise<Result<Pass>> {
    const license = await Promise.all([
      this.fetchLicense(user),
      this.fetchCategories(),
    ])

    if (!license) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'License fetch failed',
        },
      }
    }

    if (!license[0].ok || !license[0].data) {
      this.logger.debug(
        `No license data found for user, no pkpass payload to create`,
        { category: LOG_CATEGORY },
      )
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No drivers license data found',
        },
      }
    }

    const valid = await this.licenseIsValidForPkPass(license[0].data, user)

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

  async verifyPkPassDeprecated(data: string) {
    const res = await this.verifyPkPass(data)

    if (!res.ok) {
      return res
    }

    const newData = res.data.data

    return {
      ...res,
      data: {
        valid: res.data.valid,
        data: JSON.stringify({
          ...newData,
          photo: newData?.picture,
        }),
      },
    }
  }

  async verifyPkPass(
    data: string,
  ): Promise<Result<VerifyPkPassResult<LicenseType.DrivingLicense>>> {
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

    const nationalId = license?.socialSecurityNumber
    const name = license?.name
    const picture = license?.photo?.image ?? undefined

    if (!nationalId || !name) {
      const missingDataErrorMsg = 'Missing data. nationalId or name missing'
      this.logger.error(missingDataErrorMsg, {
        category: LOG_CATEGORY,
      })

      return {
        ok: false,
        error: {
          code: 14,
          message: missingDataErrorMsg,
        },
      }
    }

    return {
      ok: true,
      data: {
        valid: true,
        data: {
          nationalId,
          name,
          picture,
        },
      },
    }
  }

  async verifyExtraData(user: User): Promise<DrivingLicenseVerifyExtraData> {
    const res = await this.fetchLicense(user)

    if (!res.ok) {
      const errorMsg = res.error.message
        ? res.error.message
        : 'License fetch failed'
      this.logger.warn(errorMsg, { category: LOG_CATEGORY })

      throw new BadRequestException(res.error.message)
    } else if (!res.data) {
      throw new BadRequestException('No license found')
    } else if (!res.data.name) {
      throw new BadRequestException('No name found')
    }

    return {
      nationalId: user.nationalId,
      name: res.data.name,
      picture: res.data.photo?.image || undefined,
    }
  }
}

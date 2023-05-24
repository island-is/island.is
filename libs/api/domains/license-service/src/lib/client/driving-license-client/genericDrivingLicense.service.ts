import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { format } from 'kennitala'
import {
  DriverLicenseDto as DriversLicense,
  DrivingLicenseApi,
} from '@island.is/clients/driving-license'
import {
  Pass,
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import {
  createPkPassDataInput,
  parseDrivingLicensePayload,
} from './drivingLicenseMappers'
import {
  GenericLicenseClient,
  GenericLicenseLabels,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
  PkPassVerificationInputData,
} from '../../licenceService.type'
import { Locale } from '@island.is/shared/types'

/** Category to attach each log message to */
const LOG_CATEGORY = 'drivinglicense-service'

@Injectable()
export class GenericDrivingLicenseService
  implements GenericLicenseClient<DriversLicense> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private drivingApi: DrivingLicenseApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private checkLicenseValidity(
    license: DriversLicense,
  ): GenericUserLicensePkPassStatus {
    if (
      !license // || license.photo === undefined
    ) {
      return GenericUserLicensePkPassStatus.Unknown
    }

    /*
    if (!license.photo?.noted || !license.photo?.image) {
      return LicensePkPassAvailability.NotAvailable
    }
    */

    return GenericUserLicensePkPassStatus.Unknown
  }

  licenseIsValidForPkPass(payload: unknown): GenericUserLicensePkPassStatus {
    return this.checkLicenseValidity(payload as DriversLicense)
  }

  private fetchLicense = (user: User) =>
    this.drivingApi.getCurrentLicenseV5({
      nationalId: user.nationalId,
      token: user.authorization.replace(/^bearer /i, ''),
    })

  async getLicense(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    const licenseData = await this.fetchLicense(user)
    if (!licenseData) {
      return null
    }

    const payload = parseDrivingLicensePayload(licenseData, locale, labels)

    let pkpassStatus = GenericUserLicensePkPassStatus.Unknown

    if (payload) {
      pkpassStatus = this.licenseIsValidForPkPass(licenseData)
    }

    return {
      status: GenericUserLicenseStatus.HasLicense,
      payload,
      pkpassStatus,
    }
  }

  async getLicenseDetail(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(user, locale, labels)
  }

  async getPkPass(user: User): Promise<Pass | null> {
    const license = await this.fetchLicense(user)

    if (!license) {
      this.logger.warn('Missing pkpass distribution url', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const data = {} as DriversLicense

    const inputValues = createPkPassDataInput(data)

    if (!inputValues) {
      this.logger.warn('PkPassDataInput creation failed', {
        category: LOG_CATEGORY,
      })
      return null
    }

    //slice out headers from base64 image string
    //const image = data.licenseInfo?.licenseImgBase64

    if (!inputValues) return null
    //Fetch template from api?
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      /*thumbnail: image
        ? {
            imageBase64String: image.substring(image.indexOf(',') + 1).trim(),
          }
        : null,*/
    }

    const pass = await this.smartApi.generatePkPass(
      payload,
      format(user.nationalId),
    )

    if (pass.ok) {
      return pass.data
    }

    return null
  }

  async getPkPassUrl(user: User): Promise<string | null> {
    const pass = await this.getPkPass(user)

    return pass ? pass.distributionUrl : null
  }

  async getPkPassQRCode(user: User): Promise<string | null> {
    const pass = await this.getPkPass(user)

    return pass ? pass.distributionQRCode : null
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
      this.logger.warn('Pkpass verification failed', {
        ...result.error,
        category: LOG_CATEGORY,
      })

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

    /*HERE we should compare fetch the firearm license using the national id of the
      user being scanned, NOT the logged in user, but this is impossible as it stands!
      TO_DO: Implement that!

      const nationalIdFromPkPass = result.data.pass.inputFieldValues
      .find((i) => i.passInputField.identifier === 'kt')
      ?.value?.replace('-', '')

      if (nationalIdFromPkPass) {
        const license await this.fetchLicenseData(nationalIdFromPkPass)
        // and then compare to verify that the licenses sync up
      }
    */

    return {
      valid: result.data.valid,
    }
  }
}

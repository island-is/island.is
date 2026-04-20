import { User } from '@island.is/auth-nest-tools'
import { FirearmApi } from '@island.is/clients/firearm-license'
import {
  Pass,
  PassDataInput,
  Result,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import compareAsc from 'date-fns/compareAsc'
import {
  LicenseClient,
  LicensePkPassAvailability,
  LicenseType,
  PkPassVerificationInputData,
  VerifyPkPassResult,
} from '../../../licenseClient.type'
import { FirearmLicenseDto } from '../firearmLicenseClient.type'
import { createPkPassDataInput } from '../firearmLicenseMapper'
import { FirearmLicenseVerifyExtraData } from '../firearmLicensExtraData.types'
/** Category to attach each log message to */
const LOG_CATEGORY = 'firearmlicense-service'

@Injectable()
export class FirearmLicenseClient
  implements LicenseClient<LicenseType.FirearmLicense>
{
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private firearmApi: FirearmApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  clientSupportsPkPass = true
  type = LicenseType.FirearmLicense

  private checkLicenseValidityForPkPass(
    data: FirearmLicenseDto,
  ): LicensePkPassAvailability {
    if (!data || !data.licenseInfo?.expirationDate) {
      return LicensePkPassAvailability.Unknown
    }

    const expired = new Date(data.licenseInfo.expirationDate)
    const comparison = compareAsc(expired, new Date())

    if (Number.isNaN(comparison) || comparison < 0) {
      return LicensePkPassAvailability.NotAvailable
    }

    return LicensePkPassAvailability.Available
  }

  private async fetchLicenseData(
    user: User,
  ): Promise<Result<FirearmLicenseDto>> {
    const responses = await Promise.all([
      this.firearmApi.getLicenseInfo(user),
      this.firearmApi.getCategories(user),
      this.firearmApi.getPropertyInfo(user),
    ])
      .then((promises) => {
        return {
          licenseInfo: promises[0],
          categories: promises[1],
          propertyInfo: promises[2],
        }
      })
      .catch(() => {
        //unexpected error
        return null
      })

    if (!responses) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Service error',
        },
      }
    }

    const data: FirearmLicenseDto = {
      licenseInfo: null,
      categories: null,
      properties: null,
    }
    let error = null

    if (responses.licenseInfo.ok) {
      data.licenseInfo = responses.licenseInfo.data
    } else {
      error = responses.licenseInfo.error
    }

    if (responses.categories.ok) {
      data.categories = responses.categories.data
    } else {
      error = responses.categories.error
    }

    if (responses.propertyInfo.ok) {
      data.properties = responses.propertyInfo.data
    } else {
      error = responses.propertyInfo.error
    }

    if (error) {
      return {
        ok: false,
        error,
      }
    }

    return {
      ok: true,
      data,
    }
  }

  licenseIsValidForPkPass(
    payload: unknown,
  ): Promise<LicensePkPassAvailability> {
    if (typeof payload === 'string') {
      let jsonLicense: FirearmLicenseDto
      try {
        jsonLicense = JSON.parse(payload)
      } catch (e) {
        this.logger.warn('Invalid raw data', { error: e, LOG_CATEGORY })
        return Promise.resolve(LicensePkPassAvailability.Unknown)
      }
      return Promise.resolve(this.checkLicenseValidityForPkPass(jsonLicense))
    }
    return Promise.resolve(
      this.checkLicenseValidityForPkPass(payload as FirearmLicenseDto),
    )
  }

  async getLicenses(user: User): Promise<Result<Array<FirearmLicenseDto>>> {
    const licenseData = await this.fetchLicenseData(user)
    if (!licenseData.ok) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Service error',
        },
      }
    }

    return {
      ok: true,
      data: licenseData.data ? [licenseData.data] : [],
    }
  }

  private async createPkPassPayload(
    data: FirearmLicenseDto,
    nationalId: string,
  ): Promise<PassDataInput | null> {
    const inputValues = createPkPassDataInput(
      data.licenseInfo,
      data.properties,
      nationalId,
    )

    //slice out headers from base64 image string
    const image = data.licenseInfo?.licenseImgBase64
    const parsedImage = image?.substring(image.indexOf(',') + 1).trim() ?? ''

    if (!inputValues || !data.licenseInfo?.expirationDate) return null
    //Fetch template from api?
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      expirationDate: new Date(data.licenseInfo?.expirationDate).toISOString(),
      thumbnail: image
        ? {
            imageBase64String: parsedImage ?? '',
          }
        : null,
    }
    return payload
  }

  async getPkPass(user: User): Promise<Result<Pass>> {
    const license = await this.fetchLicenseData(user)

    if (!license.ok || !license.data) {
      this.logger.info(
        `No license data found for user, no pkpass payload to create`,
        { category: LOG_CATEGORY },
      )
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No firearm license data found',
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

    const pass = await this.smartApi.generatePkPass(payload)

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
        message: 'Missing pkpass distribution QR code in firearm license',
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
        message: 'Missing pkpass distribution url in firearm license',
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
  ): Promise<Result<VerifyPkPassResult<LicenseType.FirearmLicense>>> {
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

  async verifyExtraData(user: User): Promise<FirearmLicenseVerifyExtraData> {
    const license = await this.fetchLicenseData(user)
    if (!license.ok || !license.data) {
      throw new Error('No license found')
    }

    if (!license.data.licenseInfo?.name) {
      throw new Error('No name found')
    }

    return {
      nationalId: license.data.licenseInfo?.ssn ?? '',
      name: license.data.licenseInfo.name,
      picture: license.data.licenseInfo?.licenseImgBase64 ?? '',
    }
  }
}

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import { createPkPassDataInput } from './firearmLicenseMapper'
import { FirearmApi, OpenFirearmApi } from '@island.is/clients/firearm-license'
import {
  format as formatNationalId,
  sanitize as sanitizeNationalId,
} from 'kennitala'
import {
  Pass,
  PassDataInput,
  RevokePassData,
  SmartSolutionsApi,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'
import compareAsc from 'date-fns/compareAsc'
import {
  LicenseClient,
  PkPassVerification,
  PkPassVerificationInputData,
  LicensePkPassAvailability,
  Result,
} from '../../licenseClient.type'
import { FirearmLicenseDto } from './firearmLicenseClient.type'

/** Category to attach each log message to */
const LOG_CATEGORY = 'firearmlicense-service'
@Injectable()
export class FirearmLicenseClient implements LicenseClient<FirearmLicenseDto> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private firearmApi: FirearmApi,
    private openFirearmApi: OpenFirearmApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private checkLicenseValidityForPkPass(
    data: FirearmLicenseDto,
  ): LicensePkPassAvailability {
    if (!data || !data.licenseInfo?.expirationDate) {
      return LicensePkPassAvailability.Unknown
    }

    const expired = new Date(data.licenseInfo.expirationDate)
    const comparison = compareAsc(expired, new Date())

    if (isNaN(comparison) || comparison < 0) {
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
      .catch((e) => {
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

    //i hate this
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

  licenseIsValidForPkPass(payload: unknown): LicensePkPassAvailability {
    return this.checkLicenseValidityForPkPass(payload as FirearmLicenseDto)
  }

  async getLicense(user: User): Promise<Result<FirearmLicenseDto | null>> {
    const licenseData = await this.fetchLicenseData(user)
    if (!licenseData.ok) {
      this.logger.info(`Firearm license data fetch failed`)
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Service error',
        },
      }
    }

    //the user ain't got no license
    if (!licenseData.data.licenseInfo) {
      return {
        ok: true,
        data: null,
      }
    }

    return licenseData
  }

  async getLicenseDetail(
    user: User,
  ): Promise<Result<FirearmLicenseDto | null>> {
    return this.getLicense(user)
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

    if (!inputValues) return null
    //Fetch template from api?
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
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
        { LOG_CATEGORY },
      )
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No firearm license data found',
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

  async pushUpdatePass(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    return await this.smartApi.updatePkPass(
      inputData,
      formatNationalId(nationalId),
    )
  }

  async pullUpdate(nationalId: string): Promise<Result<Pass>> {
    let data
    try {
      data = await Promise.all([
        this.openFirearmApi.getVerificationLicenseInfo(nationalId),
        this.openFirearmApi.getVerificationPropertyInfo(nationalId),
      ])
    } catch (e) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'External service error',
        },
      }
    }

    const [licenseInfo, propertyInfo] = data
    if (!licenseInfo) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No license info found for user',
        },
      }
    }

    const inputValues = createPkPassDataInput(
      licenseInfo,
      propertyInfo,
      nationalId,
    )

    if (!inputValues) {
      return {
        ok: false,
        error: {
          code: 4,
          message: 'Mapping failed, invalid data',
        },
      }
    }

    const thumbnail = licenseInfo.licenseImgBase64
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      thumbnail: thumbnail
        ? {
            imageBase64String: thumbnail
              .substring(thumbnail.indexOf(',') + 1)
              .trim(),
          }
        : null,
    }

    return await this.smartApi.updatePkPass(
      payload,
      formatNationalId(nationalId),
    )
  }

  async revoke(queryId: string): Promise<Result<RevokePassData>> {
    return await this.smartApi.revokePkPass(queryId)
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string): Promise<Result<VerifyPassData>> {
    //need to parse the scanner data
    const { code, date } = JSON.parse(inputData)
    const verifyRes = await this.smartApi.verifyPkPass({ code, date })

    if (!verifyRes.ok) {
      return verifyRes
    }

    if (!verifyRes.data.valid) {
      return {
        ok: true,
        data: {
          valid: false,
        },
      }
    }

    const passNationalId = verifyRes.data.pass?.inputFieldValues.find(
      (i) => i.passInputField.identifier === 'kt',
    )?.value

    if (!passNationalId) {
      return {
        ok: false,
        error: {
          code: 14,
          message: 'Missing pass data',
        },
      }
    }
    const sanitizedPassNationalId = sanitizeNationalId(passNationalId)

    const licenseInfo = await this.openFirearmApi.getVerificationLicenseInfo(
      sanitizedPassNationalId,
    )

    if (!licenseInfo) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No license info found for user',
        },
      }
    }

    if (!licenseInfo.ssn) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Missing ssn for user',
        },
      }
    }
    //now we compare the data

    return {
      ok: true,
      data: {
        valid: licenseInfo.ssn === sanitizedPassNationalId,
      },
    }
  }
}

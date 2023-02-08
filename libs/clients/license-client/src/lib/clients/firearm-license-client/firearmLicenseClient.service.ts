import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import { createPkPassDataInput, formatNationalId } from './firearmLicenseMapper'
import { FirearmApi, OpenFirearmApi } from '@island.is/clients/firearm-license'
import { format } from 'kennitala'
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
      format(user.nationalId),
    )

    return pass
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

  async pushUpdatePass(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    return await this.smartApi.updatePkPass(
      inputData,
      formatNationalId(nationalId),
    )
  }

  async pullUpdate(nationalId: string): Promise<Result<Pass | undefined>> {
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

    return await this.smartApi.updatePkPass(payload, format(nationalId))
  }

  async revoke(queryId: string): Promise<Result<RevokePassData>> {
    return await this.smartApi.revokePkPass(queryId)
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(
    inputData: string,
    nationalId: string,
  ): Promise<Result<VerifyPassData>> {
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

    const licenseInfo = await this.openFirearmApi.getVerificationLicenseInfo(
      nationalId,
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
    //now we compare the data

    return {
      ok: true,
      data: {
        valid: licenseInfo.ssn === passNationalId,
      },
    }
  }
}

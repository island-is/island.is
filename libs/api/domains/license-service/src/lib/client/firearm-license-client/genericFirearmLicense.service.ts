import {
  GenericLicenseClient,
  GenericLicenseLabels,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
  PkPassVerificationInputData,
} from '../../licenceService.type'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import {
  createPkPassDataInput,
  parseFirearmLicensePayload,
} from './firearmLicenseMapper'
import { LicenseInfo, FirearmApi } from '@island.is/clients/firearm-license'
import { format } from 'kennitala'
import {
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { Locale } from '@island.is/shared/types'
import compareAsc from 'date-fns/compareAsc'
import { LicenseData } from './genericFirearmLicense.type'

/** Category to attach each log message to */
const LOG_CATEGORY = 'firearmlicense-service'
@Injectable()
export class GenericFirearmLicenseService
  implements GenericLicenseClient<LicenseInfo>
{
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private firearmApi: FirearmApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  async fetchLicenseData(user: User) {
    const licenseInfo = await this.firearmApi.getLicenseInfo(user)
    if (!licenseInfo) {
      return null
    }

    const categories = await this.firearmApi.getCategories(user)
    if (!categories) {
      this.logger.warn('No category info found for user', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const properties = await this.firearmApi.getPropertyInfo(user)

    const licenseData: LicenseData = {
      licenseInfo,
      properties,
      categories,
    }

    return licenseData
  }

  async getLicense(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    const licenseData = await this.fetchLicenseData(user)
    if (!licenseData) {
      return null
    }

    const payload = parseFirearmLicensePayload(licenseData, locale, labels)

    let pkpassStatus = GenericUserLicensePkPassStatus.Unknown

    if (payload) {
      pkpassStatus = GenericFirearmLicenseService.licenseIsValidForPkpass(
        licenseData.licenseInfo,
      )
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

  static licenseIsValidForPkpass(
    licenseInfo: LicenseInfo | null | undefined,
  ): GenericUserLicensePkPassStatus {
    if (!licenseInfo || !licenseInfo.expirationDate) {
      return GenericUserLicensePkPassStatus.Unknown
    }

    const expired = new Date(licenseInfo.expirationDate)
    const comparison = compareAsc(expired, new Date())

    if (isNaN(comparison) || comparison < 0) {
      return GenericUserLicensePkPassStatus.NotAvailable
    }

    return GenericUserLicensePkPassStatus.Available
  }

  async getPkPassUrl(user: User): Promise<string | null> {
    const data = await this.fetchLicenseData(user)

    if (!data) {
      this.logger.warn('Missing pkpass distribution url', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const inputValues = createPkPassDataInput(
      data.licenseInfo,
      data.properties,
      user.nationalId,
    )

    if (!inputValues) {
      this.logger.warn('PkPassDataInput creation failed', {
        category: LOG_CATEGORY,
      })
      return null
    }

    //slice out headers from base64 image string
    const image = data.licenseInfo?.licenseImgBase64

    if (!inputValues || !data.licenseInfo?.expirationDate) return null

    //Fetch template from api?
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      expirationDate: new Date(data.licenseInfo?.expirationDate).toISOString(),
      thumbnail: image
        ? {
            imageBase64String: image.substring(image.indexOf(',') + 1).trim(),
          }
        : null,
    }

    const pass = await this.smartApi.generatePkPass(
      payload,
      format(user.nationalId),
    )

    if (pass.ok) {
      if (!pass.data.distributionUrl) {
        this.logger.warn('Missing pkpass distribution url', {
          category: LOG_CATEGORY,
        })
        return null
      }
      return pass.data.distributionUrl
    }

    /**
     * TODO: Leverage the extra error data SmartApi now returns in a future branch!
     * For now we return null, just to keep existing behavior unchanged
     */
    if (pass.error) {
      this.logger.warn('Pkpass url generation failed', {
        ...pass.error,
        category: LOG_CATEGORY,
      })
    }

    return null
  }

  async getPkPassQRCode(user: User): Promise<string | null> {
    const data = await this.fetchLicenseData(user)
    if (!data) return null

    const inputValues = createPkPassDataInput(
      data.licenseInfo,
      data.properties,
      user.nationalId,
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

    const pass = await this.smartApi.generatePkPass(
      payload,
      format(user.nationalId),
    )

    if (pass.ok) {
      if (!pass.data.distributionQRCode) {
        this.logger.warn('Missing pkpass distribution QR Code', {
          category: LOG_CATEGORY,
        })
        return null
      }
      return pass.data.distributionQRCode
    }

    /**
     * TODO: Leverage the extra error data SmartApi now returns in a future branch!
     * For now we return null, just to keep existing behavior unchanged
     */

    if (pass.error) {
      this.logger.warn('Pkpass qr code generation failed', {
        ...pass.error,
        category: LOG_CATEGORY,
      })
    }

    return null
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

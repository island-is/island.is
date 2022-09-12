import {
  GenericLicenseClient,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
} from '../../licenceService.type'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import {
  createPkPassDataInput,
  parseFirearmLicensePayload,
} from './firearmLicenseMapper'
import { FetchError } from '@island.is/clients/middlewares'
import {
  CreatePkPassDataInput,
  PkPassIssuer,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import {
  LicenseInfo,
  FirearmApi,
  LicenseData,
} from '@island.is/clients/firearm-license'
import { format } from 'kennitala'

/** Category to attach each log message to */
const LOG_CATEGORY = 'firearmlicense-service'
@Injectable()
export class GenericFirearmLicenseApi
  implements GenericLicenseClient<LicenseInfo> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private firearmApi: FirearmApi,
    private smartApi: SmartSolutionsApi,
    private issuer: PkPassIssuer,
  ) {}

  private handleError(error: Partial<FetchError>): unknown {
    // Not throwing error if service returns 403 or 404. Log information instead.
    if (error.status === 403 || error.status === 404) {
      this.logger.info(`Firearm license returned ${error.status}`, {
        exception: error,
        message: (error as Error)?.message,
        category: LOG_CATEGORY,
      })
      return null
    }
    this.logger.warn('Firearm license fetch failed', {
      exception: error,
      message: (error as Error)?.message,
      category: LOG_CATEGORY,
    })

    return null
  }

  async fetchLicenseData(user: User) {
    let licenseData: unknown

    try {
      licenseData = await this.firearmApi.getLicenseData(user)
    } catch (e) {
      this.handleError(e)
    }

    return licenseData as LicenseData
  }

  async getLicense(user: User): Promise<GenericLicenseUserdataExternal | null> {
    const licenseData = await this.fetchLicenseData(user)

    if (!licenseData) {
      return null
    }

    const payload = parseFirearmLicensePayload(licenseData)

    return {
      status: GenericUserLicenseStatus.HasLicense,
      payload,
      pkpassStatus: GenericUserLicensePkPassStatus.Unknown,
    }
  }
  async getLicenseDetail(
    user: User,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(user)
  }
  async getPkPassUrl(user: User): Promise<string | null> {
    const data = await this.fetchLicenseData(user)
    const inputValues = createPkPassDataInput(
      data.licenseInfo,
      data.properties,
      user.nationalId,
    )

    //slice out headers from base64 image string
    const image = data.licenseInfo?.licenseImgBase64
    const parsedImage = image?.substring(image.indexOf(',') + 1).trim() ?? ''

    if (!inputValues) return null
    //Fetch template from api?
    const payload: CreatePkPassDataInput = {
      passTemplateId: 'dfb706c1-3a78-4518-bf25-cebbf0a93132',
      inputFieldValues: inputValues,
      thumbnail: {
        imageBase64String: parsedImage,
      },
    }

    const pass = await this.smartApi.generatePkPassUrl(
      payload,
      format(user.nationalId),
      this.issuer,
    )
    return pass ?? null
  }
  async getPkPassQRCode(user: User): Promise<string | null> {
    const data = await this.fetchLicenseData(user)

    const inputValues = createPkPassDataInput(
      data.licenseInfo,
      data.properties,
      user.nationalId,
    )

    //slice out headers from base64 image string
    const image = data.licenseInfo?.licenseImgBase64
    const parsedImage = image?.substring(image.indexOf(',') + 1).trim() ?? ''

    if (!inputValues) return null
    //Fetch template from api?
    const payload: CreatePkPassDataInput = {
      passTemplateId: 'dfb706c1-3a78-4518-bf25-cebbf0a93132',
      inputFieldValues: inputValues,
      thumbnail: {
        imageBase64String: parsedImage,
      },
    }

    const pass = await this.smartApi.generatePkPassQrCode(
      payload,
      format(user.nationalId),
      this.issuer,
    )
    return pass ?? null
  }
  async verifyPkPass(
    code: string,
    date: string,
    passTemplateId: string,
  ): Promise<PkPassVerification | null> {
    const payload = {
      dynamicBarcodeData: {
        code,
        date,
        passTemplateId,
      },
    }
    const response = await this.smartApi.verifyPkPass(payload, this.issuer)

    if (response?.data) {
      return { valid: true, data: JSON.stringify(response.data) }
    }

    const firstError = response?.errors?.[0]
    //Take the first error for now
    return {
      valid: false,
      error: {
        message: firstError?.message ?? '',
        data: firstError ? JSON.stringify(firstError) : '',
        status: '',
      },
    }
  }
}

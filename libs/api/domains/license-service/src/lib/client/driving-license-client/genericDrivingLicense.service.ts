import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
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
  PkPassVerificationError,
  PkPassVerificationInputData,
} from '../../licenceService.type'
import { Locale } from '@island.is/shared/types'
import { PkPassClient } from './pkpass.client'

/** Category to attach each log message to */
const LOG_CATEGORY = 'driving-license-service'

@Injectable()
export class GenericDrivingLicenseService
  implements GenericLicenseClient<DriversLicense>
{
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private drivingApi: DrivingLicenseApi,
    private smartApi: SmartSolutionsApi,
    private pkpassClient: PkPassClient,
  ) {}

  private checkLicenseValidity(
    license: DriversLicense,
  ): GenericUserLicensePkPassStatus {
    if (!license || license.photo === undefined) {
      return GenericUserLicensePkPassStatus.Unknown
    }

    if (!license.photo.image) {
      return GenericUserLicensePkPassStatus.NotAvailable
    }

    return GenericUserLicensePkPassStatus.Available
  }

  licenseIsValidForPkPass(payload: unknown): GenericUserLicensePkPassStatus {
    return this.checkLicenseValidity(payload as DriversLicense)
  }

  private fetchLicense = (user: User) =>
    this.drivingApi.getCurrentLicenseV5({
      nationalId: user.nationalId,
      token: user.authorization.replace(/^bearer /i, ''),
    })

  private fetchCategories = () => this.drivingApi.getRemarksCodeTable()

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
    const licenseData = await Promise.all([
      this.fetchLicense(user),
      this.fetchCategories(),
    ])

    if (!licenseData) {
      this.logger.warn('License data fetch failed', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const inputValues = createPkPassDataInput(licenseData[0], licenseData[1])

    if (!inputValues) {
      this.logger.warn('PkPassDataInput creation failed', {
        category: LOG_CATEGORY,
      })
      return null
    }

    //slice out headers from base64 image string
    const image = licenseData[0]?.photo?.image

    if (!inputValues) return null
    //Fetch template from api?
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      expirationDate: licenseData[0]?.dateValidTo?.toISOString(),
      thumbnail: image
        ? {
            imageBase64String: image.substring(image.indexOf(',') + 1).trim(),
          }
        : null,
    }

    const pass = await this.smartApi.generatePkPass(payload, () =>
      this.drivingApi.notifyOnPkPassCreation({
        nationalId: user.nationalId,
        token: user.authorization.replace(/^bearer /i, ''),
      }),
    )

    if (pass.ok) {
      return pass.data
    }

    this.logger.warn('PkPass creation failed', {
      category: LOG_CATEGORY,
      ...pass.error,
    })

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
    const parsedInput = JSON.parse(data)

    const { code, date } = parsedInput as PkPassVerificationInputData
    const { passTemplateId } = parsedInput

    if (!passTemplateId) {
      return this.verifyPkPassV1(data)
    }

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
      valid: result.data.valid,
      data: JSON.stringify({
        nationalId: licenseNationalId,
        name,
        photo,
        rawData,
      }),
    }
  }

  private async verifyPkPassV1(
    data: string,
  ): Promise<PkPassVerification | null> {
    const result = await this.pkpassClient.verifyPkpassByPdf417(data)

    if (!result) {
      this.logger.warn('Missing pkpass verify from client', {
        category: LOG_CATEGORY,
      })
      return null
    }

    let error: PkPassVerificationError | undefined

    if (result.error) {
      let data = ''

      try {
        data = JSON.stringify(result.error.serviceError?.data)
      } catch {
        // noop
      }

      // Is there a status code from the service?
      const serviceErrorStatus = result.error.serviceError?.status

      // Use status code, or http status code from serivce, or "0" for unknown
      const status = serviceErrorStatus ?? (result.error.statusCode || 0)

      error = {
        status: status.toString(),
        message: result.error.serviceError?.message || 'Unknown error',
        data,
      }

      return {
        valid: false,
        data: undefined,
        error,
      }
    }

    let response

    if (result.nationalId) {
      const nationalId = result.nationalId.replace('-', '')
      const license = await this.drivingApi.getCurrentLicenseV4({
        nationalId: nationalId,
      })

      if (!license) {
        error = {
          status: '0',
          message: 'missing license',
        }
      }

      const licenseNationalId = license?.socialSecurityNumber
      const name = license?.name
      const photo = license?.photo?.image ?? ''

      const rawData = license ? JSON.stringify(license) : undefined

      response = {
        nationalId: licenseNationalId,
        name,
        photo,
        rawData,
      }
    }

    return {
      valid: result.valid,
      data: response ? JSON.stringify(response) : undefined,
      error,
    }
  }
}

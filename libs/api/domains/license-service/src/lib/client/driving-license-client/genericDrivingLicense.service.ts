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
  implements GenericLicenseClient<DriversLicense> {
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

  private async fetchLicense(user: User): Promise<DriversLicense> {
    return {
      ...(await this.drivingApi.getCurrentLicenseV5({
        nationalId: user.nationalId,
        token: user.authorization.replace(/^bearer /i, ''),
      })),
      comments: [
        {
          id: 37132486,
          nr: '01.06',
          comment: null,
        },
      ],
      photo: {
        id: 1456236,
        socialSecurityNumber: '1111932749',
        dateRegistered: new Date('1900-01-01T10:58:07.437'),
        image:
          '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',
        quality: 1,
        program: 5,
        type: 1,
      },
    }
  }

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

    const pass = await this.smartApi.generatePkPass(
      payload,
      format(user.nationalId),
      () =>
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

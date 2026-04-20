import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { AdrApi, AdrDto } from '@island.is/clients/adr-and-machine-license'
import { FetchError } from '@island.is/clients/middlewares'
import {
  Pass,
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import compareAsc from 'date-fns/compareAsc'
import { format } from 'kennitala'
import {
  LicenseClient,
  LicensePkPassAvailability,
  LicenseType,
  PkPassVerificationInputData,
  Result,
  VerifyPkPassResult,
} from '../../licenseClient.type'
import { FlattenedAdrDto } from './adrLicenseClient.type'
import {
  createPkPassDataInput,
  parseAdrLicenseResponse,
} from './adrLicenseClientMapper'
import { GeneralLicenseVerifyExtraData } from '../base'

/** Category to attach each log message to */
const LOG_CATEGORY = 'adrlicense-service'

@Injectable()
export class AdrLicenseClient implements LicenseClient<LicenseType.AdrLicense> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private adrApi: AdrApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  clientSupportsPkPass = true
  type = LicenseType.AdrLicense

  private checkLicenseValidityForPkPass(
    licenseInfo: AdrDto,
  ): LicensePkPassAvailability {
    if (!licenseInfo || !licenseInfo.gildirTil) {
      return LicensePkPassAvailability.Unknown
    }

    const expired = new Date(licenseInfo.gildirTil)
    const comparison = compareAsc(expired, new Date())

    if (Number.isNaN(comparison) || comparison < 0) {
      return LicensePkPassAvailability.NotAvailable
    }

    return LicensePkPassAvailability.Available
  }

  private async fetchLicense(user: User): Promise<Result<AdrDto | null>> {
    try {
      const licenseInfo = await this.adrApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getAdr()
      return { ok: true, data: licenseInfo }
    } catch (e) {
      //404 - no license for user, still ok!
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        if (e.status === 404) {
          return { ok: true, data: null }
        } else {
          error = {
            code: 13,
            message: 'Service failure',
            data: JSON.stringify(e.body),
          }
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

  licenseIsValidForPkPass(
    payload: unknown,
  ): Promise<LicensePkPassAvailability> {
    if (typeof payload === 'string') {
      let jsonLicense: AdrDto
      try {
        jsonLicense = JSON.parse(payload)
      } catch (e) {
        this.logger.warn('Invalid raw data', { error: e, LOG_CATEGORY })
        return Promise.resolve(LicensePkPassAvailability.Unknown)
      }
      return Promise.resolve(this.checkLicenseValidityForPkPass(jsonLicense))
    }
    return Promise.resolve(
      this.checkLicenseValidityForPkPass(payload as AdrDto),
    )
  }

  async getLicenses(user: User): Promise<Result<Array<FlattenedAdrDto>>> {
    const licenseData = await this.fetchLicense(user)

    if (!licenseData.ok) {
      return licenseData
    }

    if (licenseData.data === null) {
      //user doesn't have a license
      return {
        ok: true,
        data: [],
      }
    }

    const parsedData = parseAdrLicenseResponse(licenseData.data)

    return {
      ok: true,
      data: [parsedData],
    }
  }

  private async createPkPassPayload(
    data: AdrDto,
    nationalId: string,
  ): Promise<PassDataInput | null> {
    const inputValues = createPkPassDataInput(data, format(nationalId))

    if (!inputValues) return null
    //Fetch template from api?
    return {
      inputFieldValues: inputValues,
      expirationDate: data.gildirTil,
    }
  }

  private async getPkPass(user: User): Promise<Result<Pass>> {
    const license = await this.fetchLicense(user)

    if (!license.ok || !license.data) {
      this.logger.info(
        `No license data found for user, no pkpass payload to create`,
        { category: LOG_CATEGORY },
      )
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No adr license data found',
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

    return this.smartApi.generatePkPass(payload)
  }

  async getPkPassQRCode(user: User): Promise<Result<string>> {
    const res = await this.getPkPass(user)

    if (!res.ok) {
      return res
    }

    if (!res.data.distributionQRCode) {
      const error = {
        code: 13,
        message: 'Missing pkpass distribution qr code in adr license',
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
        message: 'Missing pkpass distribution url in adr license',
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
  ): Promise<Result<VerifyPkPassResult<LicenseType.AdrLicense>>> {
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

  async verifyExtraData(user: User): Promise<GeneralLicenseVerifyExtraData> {
    const res = await this.fetchLicense(user)

    if (!res.ok) {
      throw new Error(res.error.message)
    } else if (!res.data) {
      throw new Error('No license found')
    } else if (!res.data.fulltNafn) {
      throw new Error('No name found')
    }

    return {
      nationalId: res.data.kennitala ?? '',
      name: res.data.fulltNafn,
    }
  }
}

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
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
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  createPkPassDataInput,
  parseAdrLicensePayload,
} from './adrLicenseMapper'
import { AdrApi, AdrDto } from '@island.is/clients/adr-and-machine-license'
import {
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { format } from 'kennitala'
import { handle404 } from '@island.is/clients/middlewares'
import { Locale } from '@island.is/shared/types'

/** Category to attach each log message to */
const LOG_CATEGORY = 'adrlicense-service'

@Injectable()
export class GenericAdrLicenseApi implements GenericLicenseClient<AdrDto> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private adrApi: AdrApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private adrApiWithAuth = (user: User) =>
    this.adrApi.withMiddleware(new AuthMiddleware(user as Auth))

  async fetchLicense(user: User) {
    const license = await this.adrApiWithAuth(user).getAdr().catch(handle404)
    return license
  }

  async getLicense(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    const licenseData = await this.fetchLicense(user)

    if (!licenseData) {
      return null
    }
    const payload = parseAdrLicensePayload(licenseData, locale, labels)

    if (payload) {
      return {
        status: GenericUserLicenseStatus.HasLicense,
        payload,
        pkpassStatus: GenericUserLicensePkPassStatus.Available,
      }
    }

    return {
      status: GenericUserLicenseStatus.NotAvailable,
      payload,
      pkpassStatus: GenericUserLicensePkPassStatus.NotAvailable,
    }
  }

  async getLicenseDetail(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(user, locale, labels)
  }

  private async createPkPassPayload(user: User): Promise<PassDataInput | null> {
    const license = await this.fetchLicense(user)
    if (!license) {
      return null
    }

    const inputValues = createPkPassDataInput(license)
    if (!inputValues) return null
    //Fetch template from api?
    return {
      inputFieldValues: inputValues,
    }
  }

  async getPkPassUrl(user: User): Promise<string | null> {
    const payload = await this.createPkPassPayload(user)

    if (!payload) {
      return null
    }

    const pass = await this.smartApi.generatePkPassUrl(
      payload,
      format(user.nationalId),
    )
    return pass ?? null
  }
  async getPkPassQRCode(user: User): Promise<string | null> {
    const payload = await this.createPkPassPayload(user)

    if (!payload) {
      return null
    }
    const pass = await this.smartApi.generatePkPassQrCode(
      payload,
      format(user.nationalId),
    )

    return pass ?? null
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

    /*
      TODO: VERIFICATION!!!!!!!! Máni (thorkellmani @ github)
    */

    return {
      valid: result.valid,
      error,
    }
  }
}

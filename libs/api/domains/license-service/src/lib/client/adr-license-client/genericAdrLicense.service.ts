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
import { FetchError, handle404 } from '@island.is/clients/middlewares'
import { Locale } from '@island.is/shared/types'
import compareAsc from 'date-fns/compareAsc'

/** Category to attach each log message to */
const LOG_CATEGORY = 'adrlicense-service'

@Injectable()
export class GenericAdrLicenseService implements GenericLicenseClient<AdrDto> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private adrApi: AdrApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private handleGetLicenseError = (e: Error) => {
    if (e instanceof FetchError) {
      const err = e as FetchError

      // STATUS CODES FROM VE
      // 404 - User dont exist
      // 404 - User has no license
      // 404 - Natid not in natreg
      // 200 - ok
      // 401 - unauthroized
      // 500 - server error

      if ([401, 404].includes(err.status)) {
        switch (err.status) {
          case 404:
            //THIS IS IN ICELANDIC, ALSO BAD HANDLING TODO:
            this.logger.info(err.body + '', {
              category: LOG_CATEGORY,
            })
            break
          case 401:
            this.logger.warning('Missing or invalid national id', {
              category: LOG_CATEGORY,
            })
            break
          default:
            break
        }
        return null
      }
    }

    throw e
  }

  private adrApiWithAuth = (user: User) =>
    this.adrApi.withMiddleware(new AuthMiddleware(user as Auth))

  async fetchLicense(user: User) {
    const license = await this.adrApiWithAuth(user)
      .getAdr()
      .catch(this.handleGetLicenseError)
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

    let pkpassStatus = GenericUserLicensePkPassStatus.Unknown

    if (payload) {
      pkpassStatus = GenericAdrLicenseService.licenseIsValidForPkpass(
        licenseData,
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

  static licenseIsValidForPkpass(
    licenseInfo: AdrDto | null | undefined,
  ): GenericUserLicensePkPassStatus {
    if (!licenseInfo || !licenseInfo.gildirTil) {
      return GenericUserLicensePkPassStatus.Unknown
    }

    const expired = new Date(licenseInfo.gildirTil)
    const comparison = compareAsc(expired, new Date())

    if (isNaN(comparison) || comparison < 0) {
      return GenericUserLicensePkPassStatus.NotAvailable
    }

    return GenericUserLicensePkPassStatus.Available
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
      Currently Impossible
      A robust verification needs to both check that the PkPass is valid,
      and that the user being scanned does indeed have a license!.
      This method currently checks the validity of the PkPass, but we can't
      inspect the validity of their actual ADR license. As of now, we can
      only retrieve the license of a logged in user, not the user being scanned!
    */

    return {
      valid: result.valid,
      error,
    }
  }
}

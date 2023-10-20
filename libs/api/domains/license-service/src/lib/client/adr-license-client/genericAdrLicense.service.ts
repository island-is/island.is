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

  private adrApiWithAuth = (user: User) =>
    this.adrApi.withMiddleware(new AuthMiddleware(user as Auth))

  fetchLicense = (user: User) =>
    this.adrApiWithAuth(user).getAdr().catch(handle404)

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
      pkpassStatus =
        GenericAdrLicenseService.licenseIsValidForPkpass(licenseData)
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

    const inputValues = createPkPassDataInput(license, format(user.nationalId))
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
      this.logger.warn('Pkpass payload creation failed', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const pass = await this.smartApi.generatePkPass(payload)

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
    const payload = await this.createPkPassPayload(user)

    if (!payload) {
      return null
    }
    const pass = await this.smartApi.generatePkPass(payload)

    if (pass.ok) {
      if (!pass.data.distributionQRCode) {
        this.logger.warn('Missing pkpass distribution qr code', {
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
      valid: result.data.valid,
    }
  }
}

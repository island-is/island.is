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
  VinnuvelaApi,
  VinnuvelaDto,
} from '@island.is/clients/adr-and-machine-license'
import {
  createPkPassDataInput,
  parseMachineLicensePayload,
} from './machineLicenseMapper'
import { handle404 } from '@island.is/clients/middlewares'
import {
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { format } from 'kennitala'
import { Locale } from 'locale'

/** Category to attach each log message to */
const LOG_CATEGORY = 'machinelicense-service'

@Injectable()
export class GenericMachineLicenseService
  implements GenericLicenseClient<VinnuvelaDto>
{
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private machineApi: VinnuvelaApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private machineApiWithAuth = (user: User) =>
    this.machineApi.withMiddleware(new AuthMiddleware(user as Auth))

  fetchLicense = (user: User) =>
    this.machineApiWithAuth(user).getVinnuvela().catch(handle404)

  async getLicense(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    const licenseData = await this.fetchLicense(user)

    if (!licenseData) {
      return null
    }

    const payload = parseMachineLicensePayload(licenseData, locale, labels)

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

  private async createPkPassPayload(
    user: User,
    locale: Locale,
  ): Promise<PassDataInput | null> {
    const license = await this.fetchLicense(user)
    if (!license) {
      return null
    }

    const inputValues = createPkPassDataInput(license, user.nationalId, locale)
    if (!inputValues) return null
    //Fetch template from api?
    return {
      inputFieldValues: inputValues,
    }
  }

  async getPkPassUrl(
    user: User,
    data?: unknown,
    locale?: Locale,
  ): Promise<string | null> {
    //TODO: Better locale handling thank u
    const payload = await this.createPkPassPayload(user, locale ?? 'is')

    if (!payload) {
      this.logger.warn('Pkpass payload creation failed', {
        category: LOG_CATEGORY,
      })
      return null
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
  async getPkPassQRCode(
    user: User,
    data?: unknown,
    locale?: Locale,
  ): Promise<string | null> {
    const payload = await this.createPkPassPayload(user, locale ?? 'is')

    if (!payload) {
      return null
    }

    const pass = await this.smartApi.generatePkPass(
      payload,
      format(user.nationalId),
    )
    if (pass.ok) {
      if (!pass.data.distributionQRCode) {
        this.logger.warn('Missing pkpass distribution qr code', {
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

    /*
      TODO: VERIFICATION!!!!!!!! Máni (thorkellmani @ github)
      Currently Impossible
      A robust verification needs to both check that the PkPass is valid,
      and that the user being scanned does indeed have a license!.
      This method currently checks the validity of the PkPass, but we can't
      inspect the validity of their actual machine license. As of now, we can
      only retrieve the license of a logged in user, not the user being scanned!
    */

    return {
      valid: result.data.valid,
    }
  }
}

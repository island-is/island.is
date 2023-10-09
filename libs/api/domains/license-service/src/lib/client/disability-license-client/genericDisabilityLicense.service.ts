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
import { User } from '@island.is/auth-nest-tools'
import {
  createPkPassDataInput,
  parseDisabilityLicensePayload,
} from './disabilityLicenseMapper'
import {
  DisabilityLicenseService,
  OrorkuSkirteini,
} from '@island.is/clients/disability-license'
import {
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { Locale } from '@island.is/shared/types'
import compareAsc from 'date-fns/compareAsc'

/** Category to attach each log message to */
const LOG_CATEGORY = 'disability-license-service'

@Injectable()
export class GenericDisabilityLicenseService
  implements GenericLicenseClient<OrorkuSkirteini>
{
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private disabilityLicenseApi: DisabilityLicenseService,
    private smartApi: SmartSolutionsApi,
  ) {}

  fetchLicense = (user: User) =>
    this.disabilityLicenseApi.getDisabilityLicense(user)

  async getLicense(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    const licenseData = await this.fetchLicense(user)
    if (!licenseData) {
      return null
    }
    const isEmpty = Object.values(licenseData).every((item) =>
      item ? false : true,
    )

    if (isEmpty) {
      return null
    }

    const payload = parseDisabilityLicensePayload(licenseData, locale, labels)

    let pkpassStatus = GenericUserLicensePkPassStatus.Unknown

    if (payload) {
      pkpassStatus =
        GenericDisabilityLicenseService.licenseIsValidForPkpass(licenseData)
      return {
        status: GenericUserLicenseStatus.HasLicense,
        payload,
        pkpassStatus,
      }
    }

    return {
      status: GenericUserLicenseStatus.NotAvailable,
      payload,
      pkpassStatus: GenericUserLicensePkPassStatus.NotAvailable,
    }
  }

  static licenseIsValidForPkpass(
    licenseInfo: OrorkuSkirteini | null | undefined,
  ): GenericUserLicensePkPassStatus {
    if (!licenseInfo || !licenseInfo.gildirtil) {
      return GenericUserLicensePkPassStatus.Unknown
    }

    const expired = new Date(licenseInfo.gildirtil)
    const comparison = compareAsc(expired, new Date())

    if (isNaN(comparison) || comparison < 0) {
      return GenericUserLicensePkPassStatus.NotAvailable
    }

    return GenericUserLicensePkPassStatus.Available
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
    return {
      inputFieldValues: inputValues,
      expirationDate: license.rennurut?.toISOString(),
    }
  }

  async getPkPassUrl(user: User): Promise<string | null> {
    const payload = await this.createPkPassPayload(user)

    if (!payload) {
      this.logger.warn('Pkpass payload creation failed', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const pass = await this.smartApi.generatePkPass(payload, user.nationalId)

    if (pass.ok) {
      if (!pass.data.distributionUrl) {
        this.logger.warn(
          'Missing pkpass distribution url in disability license',
          {
            category: LOG_CATEGORY,
          },
        )
        return null
      }
      return pass.data.distributionUrl
    }
    /**
     * TODO: Leverage the extra error data SmartApi now returns in a future branch!
     * For now we return null, just to keep existing behavior unchanged
     */

    if (pass.error) {
      this.logger.warn('Pkpass generation failed', {
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
    const pass = await this.smartApi.generatePkPass(payload, user.nationalId)

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
      this.logger.warn('Pkpass qrcode generation failed', {
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
      TODO: VERIFICATION Máni (thorkellmani @ github)
      Currently Impossible
      A robust verification needs to both check that the PkPass is valid,
      and that the user being scanned does indeed have a license!.
      This method currently checks the validity of the PkPass, but we can't
      inspect the validity of their actual disability license. As of now, we can
      only retrieve the license of a logged in user, not the user being scanned!
    */

    return {
      valid: result.data.valid,
    }
  }
}

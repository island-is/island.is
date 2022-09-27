import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  GenericLicenseClient,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
  PkPassVerificationError,
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
} from './machineLicenseMappers'
import { FetchError } from '@island.is/clients/middlewares'
import {
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { format } from 'kennitala'
import { Locale } from 'locale'

/** Category to attach each log message to */
const LOG_CATEGORY = 'machinelicense-service'

@Injectable()
export class GenericMachineLicenseApi
  implements GenericLicenseClient<VinnuvelaDto> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private machineApi: VinnuvelaApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private handleError(error: Partial<FetchError>): unknown {
    // Not throwing error if service returns 403 or 404. Log information instead.
    if (error.status === 403 || error.status === 404) {
      this.logger.info(`Machine license returned ${error.status}`, {
        exception: error,
        message: (error as Error)?.message,
        category: LOG_CATEGORY,
      })
      return null
    }
    this.logger.error('Machine license fetch failed', {
      exception: error,
      message: (error as Error)?.message,
      category: LOG_CATEGORY,
    })

    return null
  }
  async fetchLicense(user: User) {
    let license: unknown

    try {
      license = await this.machineApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getVinnuvela()
    } catch (e) {
      this.handleError(e)
    }
    return license as VinnuvelaDto
  }

  async getLicense(user: User): Promise<GenericLicenseUserdataExternal | null> {
    const license = await this.fetchLicense(user)

    if (!license) {
      this.logger.warn('Missing machine license, null from api', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const payload = parseMachineLicensePayload(license)

    return {
      status: GenericUserLicenseStatus.HasLicense,
      payload,
      pkpassStatus: GenericUserLicensePkPassStatus.NotAvailable,
    }
  }

  async getLicenseDetail(
    user: User,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(user)
  }

  async getPkPassUrl(
    user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data?: unknown,
    locale?: Locale,
  ): Promise<string | null> {
    const license = await this.fetchLicense(user)
    const inputValues = createPkPassDataInput(license, user.nationalId, locale)
    if (!inputValues) return null
    //Fetch template from api?
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
    }

    const pass = await this.smartApi.generatePkPassUrl(
      payload,
      format(user.nationalId),
    )
    return pass ?? null
  }
  async getPkPassQRCode(user: User): Promise<string | null> {
    const license = await this.fetchLicense(user)
    const inputValues = createPkPassDataInput(license, user.nationalId)

    if (!inputValues) return null
    //Fetch template from api?
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
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

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  GenericLicenseClient,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
} from '../../licenceService.type'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  createPkPassDataInput,
  parseAdrLicensePayload,
} from './adrLicenseMapper'
import { AdrApi, AdrDto } from '@island.is/clients/adr-and-machine-license'
import { FetchError } from '@island.is/clients/middlewares'
import {
  CreatePkPassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'

/** Category to attach each log message to */
const LOG_CATEGORY = 'adrlicense-service'

@Injectable()
export class GenericAdrLicenseApi implements GenericLicenseClient<AdrDto> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private adrApi: AdrApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  private handleError(error: Partial<FetchError>): unknown {
    // Not throwing error if service returns 403 or 404. Log information instead.
    if (error.status === 403 || error.status === 404) {
      this.logger.info(`ADR license returned ${error.status}`, {
        exception: error,
        message: (error as Error)?.message,
        category: LOG_CATEGORY,
      })
      return null
    }
    this.logger.error('ADR license fetch failed', {
      exception: error,
      message: (error as Error)?.message,
      category: LOG_CATEGORY,
    })

    return null
  }

  async fetchLicense(user: User) {
    let license: unknown
    try {
      license = await this.adrApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getAdr()
    } catch (e) {
      this.handleError(e)
    }

    return license as AdrDto
  }

  async getLicense(user: User): Promise<GenericLicenseUserdataExternal | null> {
    const license = await this.fetchLicense(user)

    if (!license) {
      this.logger.warn('Missing ADR license, null from api', {
        category: LOG_CATEGORY,
      })
      return null
    }
    const payload = parseAdrLicensePayload(license)

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

  async getPkPassUrl(user: User): Promise<string | null> {
    const license = await this.fetchLicense(user)
    const inputValues = createPkPassDataInput(license)
    if (!inputValues) return null
    //Fetch template from api?
    const payload: CreatePkPassDataInput = {
      passTemplateId: '4e49febe-7ca9-49e3-a3be-3be70cb996c2',
      inputFieldValues: inputValues,
    }

    const pass = await this.smartApi.generatePkPassUrl(payload)
    return pass ?? null
  }
  async getPkPassQRCode(user: User): Promise<string | null> {
    const license = await this.fetchLicense(user)
    const inputValues = createPkPassDataInput(license)

    if (!inputValues) return null
    //Fetch template from api?
    const payload: CreatePkPassDataInput = {
      passTemplateId: '4e49febe-7ca9-49e3-a3be-3be70cb996c2',
      inputFieldValues: inputValues,
    }
    const pass = await this.smartApi.generatePkPassQrCode(payload)
    return pass ?? null
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    return null
  }
}

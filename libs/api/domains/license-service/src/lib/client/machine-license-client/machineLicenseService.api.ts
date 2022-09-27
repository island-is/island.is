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
  VinnuvelaApi,
  VinnuvelaDto,
} from '@island.is/clients/adr-and-machine-license'
import {
  createPkPassDataInput,
  parseMachineLicensePayload,
} from './machineLicenseMappers'
import { FetchError } from '@island.is/clients/middlewares'
import {
  CreatePkPassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'

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

  async getPkPassUrl(user: User): Promise<string | null> {
    const license = await this.fetchLicense(user)
    const inputValues = createPkPassDataInput(license, user.nationalId)
    //const backside = createPkPassDataBackside(license)
    if (!inputValues) return null
    //Fetch template from api?
    const payload: CreatePkPassDataInput = {
      passTemplateId: '61012578-c2a0-489e-8dbd-3df5b3e538ea',
      inputFieldValues: inputValues,
    }

    const pass = await this.smartApi.generatePkPassUrl(payload)
    return pass ?? null
  }
  async getPkPassQRCode(user: User): Promise<string | null> {
    const license = await this.fetchLicense(user)
    const inputValues = createPkPassDataInput(license, user.nationalId)

    if (!inputValues) return null
    //Fetch template from api?
    const payload: CreatePkPassDataInput = {
      passTemplateId: '61012578-c2a0-489e-8dbd-3df5b3e538ea',
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

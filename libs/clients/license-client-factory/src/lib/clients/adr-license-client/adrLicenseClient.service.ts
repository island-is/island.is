import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { createPkPassDataInput } from './adrLicenseClientMapper'
import { AdrApi, AdrDto } from '@island.is/clients/adr-and-machine-license'
import { PassDataInput } from '@island.is/clients/smartsolutions'
import { format } from 'kennitala'
import compareAsc from 'date-fns/compareAsc'
import { parseAdrLicenseResponse } from './adrLicenseClientMapper'
import { FlattenedAdrDto } from './adrLicenseClient.type'
import { LicenseClient, PkPassAvailability } from '../../licenseClient.type'
import {
  PkPass,
  SmartSolutionsService,
} from '@island.is/clients/smart-solutions'

/** Category to attach each log message to */
const LOG_CATEGORY = 'adrlicense-service'

@Injectable()
export class AdrLicenseClient implements LicenseClient<FlattenedAdrDto> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private adrApi: AdrApi,
    private smartApi: SmartSolutionsService,
  ) {}

  clientSupportsPkPass = true

  private checkLicenseValidityForPkPass(
    licenseInfo: AdrDto,
  ): PkPassAvailability {
    if (!licenseInfo || !licenseInfo.gildirTil) {
      return 'unknown'
    }

    const expired = new Date(licenseInfo.gildirTil)
    const comparison = compareAsc(expired, new Date())

    if (Number.isNaN(comparison) || comparison < 0) {
      return 'not-available'
    }

    return 'available'
  }

  private async fetchLicense(user: User): Promise<AdrDto | null> {
    return this.adrApi.withMiddleware(new AuthMiddleware(user as Auth)).getAdr()
  }

  licenseIsValidForPkPass(payload: unknown): PkPassAvailability {
    if (typeof payload === 'string') {
      let jsonLicense: AdrDto
      try {
        jsonLicense = JSON.parse(payload)
      } catch (e) {
        this.logger.warn('Invalid raw data', { error: e, LOG_CATEGORY })
        return 'unknown'
      }
      return this.checkLicenseValidityForPkPass(jsonLicense)
    }
    return this.checkLicenseValidityForPkPass(payload as AdrDto)
  }

  async getLicenses(user: User): Promise<Array<FlattenedAdrDto>> {
    const licenseData = await this.fetchLicense(user)

    if (!licenseData) {
      return []
    }

    const parsedData = parseAdrLicenseResponse(licenseData)

    return [parsedData]
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

  private async getPkPass(user: User): Promise<PkPass | null> {
    const license = await this.fetchLicense(user)

    if (!license) {
      this.logger.warn(
        `No license data found for user, no pkpass payload to create`,
        { category: LOG_CATEGORY },
      )
      throw new Error('No license data for user, pkpass fetch aborted')
    }

    const valid = this.licenseIsValidForPkPass(license)

    if (!valid) {
      this.logger.warn('Pass is invalid for pkpass generation', {
        category: LOG_CATEGORY,
      })
      throw new Error(
        'Pass is invalid for pkpass generation,  pkpass fetch/creation aborted',
      )
    }

    const payload = await this.createPkPassPayload(license, user.nationalId)

    if (!payload) {
      this.logger.warn(`No payload created`, { category: LOG_CATEGORY })
      throw new Error('No payload created, pkpass fetch/creation aborted')
    }

    return this.smartApi.generatePkPass(payload)
  }

  async getPkPassQRCode(user: User): Promise<string> {
    const pass = await this.getPkPass(user)

    if (!pass) {
      thi
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

  async getPkPassUrl(user: User): Promise<string> {
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

  async verifyPkPass(data: string): Promise<PkPassVerification> {
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
      data: result.data,
    }
  }
}

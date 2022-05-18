/* eslint-disable @typescript-eslint/no-unused-vars */
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Cache as CacheManager } from 'cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common'
import {
  CONFIG_PROVIDER,
  GenericLicenseClient,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
} from '../../licenceService.type'
import { GenericAdrLicenseResponse } from './genericAdrLicense.type'
import { User } from '@island.is/auth-nest-tools'
import { AdrApi } from '@island.is/clients/aosh'
import { parseAdrLicensePayload } from './adrLicenseMapper'

@Injectable()
export class GenericAdrLicenseApi
  implements GenericLicenseClient<GenericAdrLicenseResponse> {
  constructor(
    private adrLicenseApi: AdrApi,
    private cacheManager?: CacheManager | null,
  ) {
    this.cacheManager = cacheManager
  }

  async getLicense(
    nationalId: User['nationalId'],
  ): Promise<GenericLicenseUserdataExternal | null> {
    const license = (await this.adrLicenseApi.getAdr({
      kennitala: nationalId,
    })) as GenericAdrLicenseResponse

    const payload = parseAdrLicensePayload(license)

    console.log(payload)

    return {
      status: GenericUserLicenseStatus.HasLicense,
      payload,
      pkpassStatus: GenericUserLicensePkPassStatus.Available,
    }
  }

  async getLicenseDetail(
    nationalId: string,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(nationalId)
  }
  async getPkPassUrl(
    nationalId: string,
    data?: GenericAdrLicenseResponse | undefined,
  ): Promise<string | null> {
    return null
  }
  async getPkPassQRCode(
    nationalId: string,
    data?: GenericAdrLicenseResponse | undefined,
  ): Promise<string | null> {
    return null
  }
  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    return null
  }
}

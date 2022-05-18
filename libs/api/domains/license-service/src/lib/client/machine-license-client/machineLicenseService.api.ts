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
import { User } from '@island.is/auth-nest-tools'
import { VinnuvelaApi } from '@island.is/clients/aosh'
import { parseMachineLicensePayload } from './machineLicenseMappers'
import { GenericMachineLicenseResponse } from './genericMachineLicense.type'

@Injectable()
export class GenericMachineLicenseApi
  implements GenericLicenseClient<GenericMachineLicenseResponse> {
  constructor(
    private machineLicenseApi: VinnuvelaApi,
    private cacheManager?: CacheManager | null,
  ) {
    this.cacheManager = cacheManager
  }

  async getLicense(
    nationalId: User['nationalId'],
  ): Promise<GenericLicenseUserdataExternal | null> {
    const license = (await this.machineLicenseApi.getVinnuvela({
      kennitala: nationalId,
    })) as GenericMachineLicenseResponse

    const payload = parseMachineLicensePayload(license)

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
    data?: GenericMachineLicenseResponse | undefined,
  ): Promise<string | null> {
    return null
  }
  async getPkPassQRCode(
    nationalId: string,
    data?: GenericMachineLicenseResponse | undefined,
  ): Promise<string | null> {
    return null
  }
  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    return null
  }
}

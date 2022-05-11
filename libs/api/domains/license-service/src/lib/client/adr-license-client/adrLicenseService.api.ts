/* eslint-disable @typescript-eslint/no-unused-vars */
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, Logger } from '@nestjs/common'
import {
  CONFIG_PROVIDER,
  GenericLicenseClient,
  GenericLicenseUserdataExternal,
  PkPassVerification,
} from '../../licenceService.type'
import { GenericAdrLicenseResponse } from './genrericAdrLicense.type'
import { User } from '@island.is/auth-nest-tools'
import { AdrApi } from '@island.is/clients/aosh'

@Injectable()
export class GenericAdrLicenseApi
  implements GenericLicenseClient<GenericAdrLicenseResponse> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private adrLicenseApi: AdrApi,
  ) {
    this.logger = logger
  }

  async getLicense(
    nationalId: User['nationalId'],
  ): Promise<GenericLicenseUserdataExternal | null> {
    const license = (await this.adrLicenseApi.getAdr({
      kennitala: nationalId,
    })) as GenericAdrLicenseResponse
    return license
  }

  async getLicenseDetail(
    nationalId: string,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return null
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

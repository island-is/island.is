import { Inject, Injectable } from '@nestjs/common'
import {
  CONFIG_PROVIDER,
  LICENSE_CLIENT_FACTORY,
  LicenseClient,
  LicenseType,
} from './licenseClient.type'
import type { PassTemplateIds, LicenseTypeType } from './licenseClient.type'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class LicenseClientService {
  constructor(
    @Inject(LICENSE_CLIENT_FACTORY)
    private licenseFactory: (
      type: LicenseType,
    ) => Promise<LicenseClient<unknown | null>>,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(CONFIG_PROVIDER) private config: PassTemplateIds,
  ) {}

  private async getClient(type: LicenseType) {
    const client = await this.licenseFactory(type)
    return client
  }

  private getTypeByPassTemplateId(id: string) {
    for (const [key, value] of Object.entries(this.config)) {
      // some license Config id === barcode id
      if (value === id) {
        // firearmLicense => FirearmLicense
        const keyAsEnumKey = key.slice(0, 1).toUpperCase() + key.slice(1)

        const valueFromEnum: LicenseType | undefined =
          LicenseType[keyAsEnumKey as LicenseTypeType]

        if (!valueFromEnum) {
          throw new Error(`Invalid license type: ${key}`)
        }
        return valueFromEnum
      }
    }
    return null
  }

  async getClientByLicenseType(type: LicenseType) {
    const client = await this.getClient(type)
    return client
  }

  async getClientByPassTemplateId(passTemplateId: string) {
    const type = this.getTypeByPassTemplateId(passTemplateId)
    if (type) {
      const client = await this.getClient(type)
      return client
    }

    return null
  }
}

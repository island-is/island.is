import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CONFIG_PROVIDER,
  LicenseType,
  LICENSE_UPDATE_CLIENT_FACTORY,
  LICENSE_UPDATE_CLIENT_FACTORY_V2,
} from './licenseClient.type'
import type { PassTemplateIds, LicenseTypeType } from './licenseClient.type'
import { LOG_CATEGORY } from '@island.is/clients/smartsolutions'
import { BaseLicenseUpdateClientV2 } from './clients/base/licenseUpdateClientV2'
import { BaseLicenseUpdateClient } from './clients/base/baseLicenseUpdateClient'

@Injectable()
export class LicenseUpdateClientService {
  constructor(
    @Inject(LICENSE_UPDATE_CLIENT_FACTORY)
    private licenseUpdateClientFactory: (
      type: LicenseType,
      requestId?: string,
    ) => Promise<BaseLicenseUpdateClient | null>,
    @Inject(LICENSE_UPDATE_CLIENT_FACTORY_V2)
    private licenseUpdateClientFactoryV2: (
      type: LicenseType,
      requestId?: string,
    ) => Promise<BaseLicenseUpdateClientV2 | null>,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(CONFIG_PROVIDER) private config: PassTemplateIds,
  ) {}

  private getTypeByPassTemplateId(id: string, requestId?: string) {
    for (const [key, value] of Object.entries(this.config)) {
      // some license Config id === barcode id
      if (value === id) {
        // firearmLicense => FirearmLicense
        const keyAsEnumKey = key.slice(0, 1).toUpperCase() + key.slice(1)

        const valueFromEnum: LicenseType | undefined =
          LicenseType[keyAsEnumKey as LicenseTypeType]

        if (!valueFromEnum) {
          this.logger.error(`Invalid license type: ${key}`, {
            category: LOG_CATEGORY,
            requestId,
            key,
          })
          throw new Error(`Invalid license type: ${key}`)
        }
        return valueFromEnum
      }
    }
    return null
  }

  getPassTemplateIdByLicenseId(type: LicenseType, requestId?: string) {
    const licenseId = (type.slice(0, 1).toLowerCase() +
      type.slice(1)) as keyof PassTemplateIds

    if (!this.config[licenseId]) {
      this.logger.error(`Invalid license type`, {
        category: LOG_CATEGORY,
        requestId,
        type,
      })
      return null
    }

    return this.config[licenseId]
  }

  /**
   * @deprecated Use getLicenseUpdateClientV2ByType instead.
   */
  getLicenseUpdateClientByType(type: LicenseType, requestId?: string) {
    return this.licenseUpdateClientFactory(type, requestId)
  }

  getLicenseUpdateClientV2ByType(type: LicenseType, requestId?: string) {
    return this.licenseUpdateClientFactoryV2(type, requestId)
  }

  /**
   * @deprecated Use getLicenseUpdateClientV2ByPassTemplateId instead.
   */
  getLicenseUpdateClientByPassTemplateId(
    passTemplateId: string,
    requestId?: string,
  ) {
    const type = this.getTypeByPassTemplateId(passTemplateId, requestId)

    return type ? this.getLicenseUpdateClientByType(type, requestId) : null
  }
  getLicenseUpdateClientV2ByPassTemplateId(
    passTemplateId: string,
    requestId?: string,
  ) {
    const type = this.getTypeByPassTemplateId(passTemplateId, requestId)

    return type ? this.getLicenseUpdateClientV2ByType(type, requestId) : null
  }
}

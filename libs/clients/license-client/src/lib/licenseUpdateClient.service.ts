import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CONFIG_PROVIDER,
  LicenseType,
  LICENSE_UPDATE_CLIENT_FACTORY,
} from './licenseClient.type'
import type { PassTemplateIds, LicenseTypeType } from './licenseClient.type'
import { BaseLicenseUpdateClient } from './clients/baseLicenseUpdateClient'
import { LOG_CATEGORY } from '@island.is/clients/smartsolutions'

@Injectable()
export class LicenseUpdateClientService {
  constructor(
    @Inject(LICENSE_UPDATE_CLIENT_FACTORY)
    private licenseUpdateClientFactory: (
      type: LicenseType,
      requestId?: string,
    ) => Promise<BaseLicenseUpdateClient | null>,
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

  getLicenseUpdateClientByType(type: LicenseType, requestId?: string) {
    return this.licenseUpdateClientFactory(type, requestId)
  }

  getLicenseUpdateClientByPassTemplateId(
    passTemplateId: string,
    requestId?: string,
  ) {
    const type = this.getTypeByPassTemplateId(passTemplateId, requestId)

    return type ? this.licenseUpdateClientFactory(type) : null
  }
}

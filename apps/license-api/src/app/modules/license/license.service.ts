import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  DeleteLicenseDto,
  PullUpdateLicenseDto,
  PushUpdateLicenseDto,
  UpdateLicenseDto,
} from './dto/license.dto'
import { SmartSolutionsApi } from '@island.is/clients/smartsolutions'
import { CLIENT_FACTORY, LicenseId, LicenseUpdateType } from './license.types'

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(CLIENT_FACTORY)
    private clientFactory: (licenseId: LicenseId) => Promise<SmartSolutionsApi>,
  ) {}

  async updateLicense(inputData: UpdateLicenseDto): Promise<string> {
    const service = await this.clientFactory(inputData.licenseId)

    let data
    if (inputData.licenseUpdateType === LicenseUpdateType.PUSH) {
      // PUSH
      data = inputData as PushUpdateLicenseDto
    } else {
      // PULL
      data = inputData as PullUpdateLicenseDto
    }
    const templates = await service.listTemplates()
    this.logger.debug(JSON.stringify(templates?.data))
    return JSON.stringify(templates)
  }

  async deleteLicense(inputData: DeleteLicenseDto) {
    this.logger.debug(JSON.stringify(inputData))
    return
  }
}

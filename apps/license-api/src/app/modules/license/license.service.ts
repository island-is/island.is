import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { DeleteLicenseDto, UpdateLicenseDto } from './dto/license.dto'
import { SmartSolutionsApi } from '@island.is/clients/smartsolutions'

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private smartApi: SmartSolutionsApi,
  ) {}

  async updateLicense(inputData: UpdateLicenseDto): Promise<string> {
    const templates = await this.smartApi.listTemplates()
    this.logger.debug(JSON.stringify(templates?.data))
    return JSON.stringify(templates)
  }

  async deleteLicense(inputData: DeleteLicenseDto) {
    this.logger.debug(JSON.stringify(inputData))
    return
  }
}

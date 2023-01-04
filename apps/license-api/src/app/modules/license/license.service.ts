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
import {
  CLIENT_FACTORY,
  GenericLicenseClient,
  LicenseId,
  LicenseUpdateType,
} from './license.types'

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(CLIENT_FACTORY)
    private clientFactory: (
      licenseId: LicenseId,
    ) => Promise<GenericLicenseClient>,
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
    const updateCall = await service.update()
    this.logger.debug(updateCall)
    return updateCall ?? ''
  }

  async deleteLicense(inputData: DeleteLicenseDto) {
    const service = await this.clientFactory(inputData.licenseId)
    const updateCall = await service.delete()
    this.logger.debug(updateCall)
    return updateCall ?? ''
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { externalData } from '@island.is/application/templates/aosh/machine-license-card-reissue'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  SeminarsClientService,
  WorkMachineLicenseDto,
} from '@island.is/clients/seminars-ver'
import { TemplateApiError } from '@island.is/nest/problem'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { getOrderApplicationDto } from './machine-license-card-reissue.utils'

@Injectable()
export class MachineLicenseCardReissueTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly seminarsClientService: SeminarsClientService,
  ) {
    super(ApplicationTypes.MACHINE_LICENSE_CARD_REISSUE)
  }

  async getLicenses({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<WorkMachineLicenseDto> {
    let license: WorkMachineLicenseDto
    try {
      license = await this.seminarsClientService.getWorkMachineLicense(
        auth,
        application.id,
      )
    } catch (error) {
      this.logger.error(
        '[machine-license-card-reissue]: Error fetching work machine license from VER',
        error,
      )
      throw new TemplateApiError(
        {
          title: externalData.ver.errorTitle,
          summary: externalData.ver.dataError,
        },
        500,
      )
    }

    if (!license.hasLicenseToPurchase) {
      throw new TemplateApiError(
        {
          title: externalData.ver.cannotOrderCardTitle,
          summary: externalData.ver.cannotOrderCardSummary,
        },
        400,
      )
    }

    return license
  }

  async submitApplication({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    try {
      await this.seminarsClientService.orderWorkMachineLicenseCard(
        auth,
        getOrderApplicationDto(application),
      )
    } catch (error) {
      this.logger.error(
        `[machine-license-card-reissue]: Error submitting card order for application ${application.id}`,
        error,
      )
      throw new TemplateApiError(
        {
          title: externalData.ver.errorTitle,
          summary: externalData.ver.submitError,
        },
        500,
      )
    }
    return { success: true }
  }
}

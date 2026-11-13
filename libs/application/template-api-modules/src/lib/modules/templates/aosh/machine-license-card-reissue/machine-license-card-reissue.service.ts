import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { coreErrorMessages } from '@island.is/application/core'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  MachineLicenseDto,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
import { TemplateApiError } from '@island.is/nest/problem'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

@Injectable()
export class MachineLicenseCardReissueTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly workMachineClientService: WorkMachinesClientService,
  ) {
    super(ApplicationTypes.MACHINE_LICENSE_CARD_REISSUE)
  }

  async getLicenses({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<MachineLicenseDto> {
    const result = await this.workMachineClientService.getLicenses(auth, {
      xCorrelationID: application.id,
    })
    if (!result?.licenseCategories?.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.licensesEmptyListDefault,
          summary: coreErrorMessages.licensesEmptyListDefault,
        },
        400,
      )
    }
    return {
      nationalId: result.nationalId,
      licenseCategories: result.licenseCategories,
    }
  }

  async submitApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    // TODO: Tengja við endapunkt Vinnueftirlitsins fyrir endurútgáfu plastkorts
    // þegar hann er tilbúinn. Senda kennitölu umsækjanda og afhendingarmáta
    // (application.answers.cardDelivery).
    this.logger.info(
      `[machine-license-card-reissue] submitApplication called for application ${application.id} - submission endpoint not implemented yet`,
    )
    return { success: true }
  }
}

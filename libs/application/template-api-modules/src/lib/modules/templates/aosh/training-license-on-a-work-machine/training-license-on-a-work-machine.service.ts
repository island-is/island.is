import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  MachineLicenseDto,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
import { coreErrorMessages } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
@Injectable()
export class TrainingLicenseOnAWorkMachineTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly workMachineClientService: WorkMachinesClientService,
  ) {
    super(ApplicationTypes.TRAINING_LICENSE_ON_A_WORK_MACHINE)
  }

  async getLicenses({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<MachineLicenseDto> {
    const result = await this.workMachineClientService.getLicenses(auth, {
      xCorrelationID: application.id,
    })
    console.log('RESULT: ', result)
    if (!result || !result.licenseCategories) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.machinesEmptyListDefault, // TODO: Write correct error  message
          summary: coreErrorMessages.machinesEmptyListDefault,
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
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // Submit
    console.log('SUBMITTING APPLICATION')
  }
}

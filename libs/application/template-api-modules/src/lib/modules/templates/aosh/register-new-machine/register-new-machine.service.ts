import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  MachineTypeDto,
  MachineParentCategoryDto,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
@Injectable()
export class RegisterNewMachineTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly workMachineClientService: WorkMachinesClientService,
  ) {
    super(ApplicationTypes.MACHINE_REGISTRATION)
  }

  async getMachineTypes({
    auth,
  }: TemplateApiModuleActionProps): Promise<MachineTypeDto[]> {
    const result = await this.workMachineClientService.getMachineTypes(auth)
    if (!result) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.machinesEmptyListDefault,
          summary: coreErrorMessages.machinesEmptyListDefault,
        },
        400,
      )
    }
    return result
  }

  async getMachineParentCategories({
    auth,
  }: TemplateApiModuleActionProps): Promise<MachineParentCategoryDto[]> {
    const result =
      await this.workMachineClientService.getMachineParentCategories(auth)
    if (!result) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.machinesEmptyListDefault,
          summary: coreErrorMessages.machinesEmptyListDefault,
        },
        400,
      )
    }
    return result
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    if (auth.nationalId !== application.applicant) {
      throw new TemplateApiError(
        {
          title: 'TODO ERROR',
          summary: 'TODO ERROR',
        },
        400,
      )
    }
  }
}

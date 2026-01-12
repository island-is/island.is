import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import { DeregisterMachineAnswers } from '@island.is/application/templates/aosh/deregister-machine'
import { statusMapping } from './deregister-machine.utils'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { applicationCheck } from '@island.is/application/templates/aosh/change-machine-supervisor'
import {
  MachinesWithTotalCount,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
@Injectable()
export class DeregisterMachineTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly workMachineClientService: WorkMachinesClientService,
  ) {
    super(ApplicationTypes.DEREGISTER_MACHINE)
  }

  async getMachines({
    auth,
  }: TemplateApiModuleActionProps): Promise<MachinesWithTotalCount> {
    const result = await this.workMachineClientService.getMachines(auth)
    if (!result || !result.totalCount) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.machinesEmptyListDefault,
          summary: coreErrorMessages.machinesEmptyListDefault,
        },
        400,
      )
    }
    if (result.totalCount <= 5) {
      return {
        machines: await Promise.all(
          result.machines.map(async (machine) => {
            if (machine.id) {
              return await this.workMachineClientService.getMachineDetail(
                auth,
                machine.id,
                'changeStatus',
              )
            }
            return machine
          }),
        ),
        totalCount: result.totalCount,
      }
    }
    return result
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as DeregisterMachineAnswers

    if (auth.nationalId !== application.applicant) {
      throw new TemplateApiError(
        {
          title: applicationCheck.submitApplication.sellerNotValid,
          summary: applicationCheck.submitApplication.sellerNotValid,
        },
        400,
      )
    }
    const machineId = answers.machine?.id
    if (!machineId) {
      throw new Error('Machine has not been selected')
    }

    await this.workMachineClientService.deregisterMachine(auth, {
      machineStatusUpdateDto: {
        machineId: machineId,
        delegateNationalId: auth.nationalId,
        ownerNationalId: auth.nationalId,
        status: statusMapping[answers.deregister.status],
        dateOfStatusChange: new Date(answers.deregister.date),
        fateOfMachine: answers.deregister.fateOfMachine,
      },
    })
  }
}

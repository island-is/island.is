import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import { RequestInspectionAnswers } from '@island.is/application/templates/aosh/request-for-inspection'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { applicationCheck } from '@island.is/application/templates/aosh/change-machine-supervisor'
import {
  MachinesWithTotalCount,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
import { cleanPhoneNumber } from './request-inspection.utils'
@Injectable()
export class RequestInspectionTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly workMachineClientService: WorkMachinesClientService,
  ) {
    super(ApplicationTypes.REQUEST_INSPECTION_FOR_MACHINE)
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
                'requestInspection',
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
    const answers = application.answers as RequestInspectionAnswers

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

    await this.workMachineClientService.requestInspection(auth, {
      machineId: machineId,
      comments: answers.location.comment,
      ownerNationalId: auth.nationalId,
      delegateNationalId: auth.nationalId,
      address: answers.location.address,
      postalCode: Number(answers.location.postalCode),
      contactName: answers.contactInformation.name,
      phoneNumber: cleanPhoneNumber(answers.contactInformation.phoneNumber),
      email: answers.contactInformation.email,
      city: answers.location.city,
    })
  }
}

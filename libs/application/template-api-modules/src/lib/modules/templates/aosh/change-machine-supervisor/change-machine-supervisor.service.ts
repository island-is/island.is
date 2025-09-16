import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import { EmailRole, UserProfile } from './types'
import { ChangeMachineSupervisorAnswers } from '@island.is/application/templates/aosh/change-machine-supervisor'
import {
  cleanPhoneNumber,
  getRecipients,
  sendNotificationsToRecipients,
} from './change-machine-supervisor.utils'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { applicationCheck } from '@island.is/application/templates/aosh/change-machine-supervisor'
import {
  MachinesWithTotalCount,
  SupervisorChange,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
@Injectable()
export class ChangeMachineSupervisorTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly workMachineClientService: WorkMachinesClientService,
  ) {
    super(ApplicationTypes.CHANGE_MACHINE_SUPERVISOR)
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
                'supervisorChange',
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
    const answers = application.answers as ChangeMachineSupervisorAnswers

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
    const userProfile = application.externalData?.userProfile
      ?.data as UserProfile
    const owner = application.externalData.identity.data as { name: string }

    const supervisorChange: SupervisorChange =
      answers.supervisor.isOwner[0] === 'ownerIsSupervisor'
        ? {
            machineId: machineId,
            delegateNationalId: auth.nationalId,
            address: answers.location?.address,
            email: userProfile.email,
            phoneNumber: cleanPhoneNumber(userProfile.mobilePhoneNumber),
            moreInfo: answers.location?.moreInfo,
            ownerNationalId: auth.nationalId,
            postalCode: answers.location?.postalCode
              ? Number(answers.location?.postalCode)
              : undefined,
            supervisorNationalId: auth.nationalId,
          }
        : {
            machineId: machineId,
            delegateNationalId: auth.nationalId,
            address: answers.location?.address,
            email: answers.supervisor.email,
            phoneNumber: cleanPhoneNumber(answers.supervisor?.phone || ''),
            moreInfo: answers.location?.moreInfo,
            ownerNationalId: auth.nationalId,
            postalCode: answers.location?.postalCode
              ? Number(answers.location?.postalCode)
              : undefined,
            supervisorNationalId: answers.supervisor.nationalId,
          }

    await this.workMachineClientService.changeMachineSupervisor(
      auth,
      supervisorChange,
    )

    // send email/sms to all recipients
    const recipientList =
      answers.supervisor.isOwner[0] === 'ownerIsSupervisor'
        ? getRecipients(answers, [EmailRole.owner], userProfile)
        : getRecipients(
            answers,
            [EmailRole.owner, EmailRole.supervisor],
            userProfile,
          )
    const errors = await sendNotificationsToRecipients(
      recipientList,
      answers.supervisor.isOwner[0] === 'ownerIsSupervisor'
        ? owner.name
        : answers.supervisor?.name || '',
      this.sharedTemplateAPIService,
      application,
    )

    if (errors.length > 0) {
      errors.forEach((error) => {
        this.logger.error(error)
      })
    }
  }
}

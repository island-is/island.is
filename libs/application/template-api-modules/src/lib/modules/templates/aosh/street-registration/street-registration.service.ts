import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { error as errorMsg } from '@island.is/application/templates/aosh/street-registration'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import { StreetRegistrationAnswers } from '@island.is/application/templates/aosh/street-registration'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { applicationCheck } from '@island.is/application/templates/aosh/change-machine-supervisor'
import {
  MachinesWithTotalCount,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
import { exrtactUserInfo, mapPlateSize } from './street-registration.utils'
@Injectable()
export class StreetRegistrationTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly workMachineClientService: WorkMachinesClientService,
  ) {
    super(ApplicationTypes.STREET_REGISTRATION)
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
                'registerForTraffic',
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

  async getTypesMustInspectBeforeRegistration({
    auth,
  }: TemplateApiModuleActionProps): Promise<string[]> {
    return await this.workMachineClientService
      .mustInspectBeforeRegistration(auth)
      .catch((error) => {
        this.logger.warning(
          '[street-registration-service]: Error fetching types requires for inspection',
          error,
        )
        throw new TemplateApiError(
          {
            title: coreErrorMessages.defaultTemplateApiError,
            summary: errorMsg.errorGetFromAOSH,
          },
          500,
        )
      })
  }

  async getAvailableRegistrationTypes({
    auth,
  }: TemplateApiModuleActionProps): Promise<string[]> {
    return await this.workMachineClientService
      .getAvailableRegistrationTypes(auth)
      .catch((error) => {
        this.logger.warning(
          '[street-registration-service]: Error fetching available types for registration',
          error,
        )
        throw new TemplateApiError(
          {
            title: coreErrorMessages.defaultTemplateApiError,
            summary: errorMsg.errorGetFromAOSH,
          },
          500,
        )
      })
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // 1. Validate payment
    // 1a. Make sure a paymentUrl was created
    const paymentUrl =
      (application.externalData.createCharge?.data as { paymentUrl?: string })
        ?.paymentUrl || ''

    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    // 1b. Make sure payment is fulfilled (has been paid)
    const payment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)
    if (!payment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as StreetRegistrationAnswers

    if (auth.nationalId !== application.applicant) {
      throw new TemplateApiError(
        {
          title: applicationCheck.submitApplication.sellerNotValid,
          summary: applicationCheck.submitApplication.sellerNotValid,
        },
        400,
      )
    }

    const userInfo = exrtactUserInfo(answers, application.externalData)
    const machineId = answers.machine?.id
    if (!machineId) {
      throw new Error('Machine has not been selected')
    }

    await this.workMachineClientService.streetRegistration(auth, {
      machineId,
      address: userInfo?.address,
      city: userInfo?.city,
      contactPhoneNumber: userInfo?.contactPhoneNumber,
      contactEmail: userInfo?.contactEmail,
      contactName: userInfo?.contactName,
      postalCode: userInfo?.postalCode,
      recipient: userInfo?.recipient,
      delegateNationalId: auth.nationalId,
      ownerNationalId: auth.nationalId,
      plateSize: mapPlateSize(answers.licencePlate.size),
    })
  }
}

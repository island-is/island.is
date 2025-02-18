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
import {
  getCleanApplicantInformation,
  getCleanCertificateOfTenure,
  getCleanCompanyInformation,
} from './training-license-on-a-work-machine.utils'
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
    const applicant = getCleanApplicantInformation(application)
    const company = getCleanCompanyInformation(application)
    const certificateOfTenure = getCleanCertificateOfTenure(application)
    await this.workMachineClientService
      .machineLicenseTeachingApplication(auth, {
        xCorrelationID: application.id,
        machineLicenseTeachingApplicationCreateDto: {
          applicant,
          company,
          machineRegistrationNumber:
            certificateOfTenure.machineRegistrationNumber,
          licenseCategoryPrefix: certificateOfTenure.licenseCategoryPrefix,
          machineType: certificateOfTenure.machineType,
          dateWorkedOnMachineFrom: certificateOfTenure.dateWorkedOnMachineFrom,
          dateWorkedOnMachineTo: certificateOfTenure.dateWorkedOnMachineTo,
          hoursWorkedOnMachine: certificateOfTenure.hoursWorkedOnMachine,
        },
      })
      .catch((error) => {
        this.logger.error(
          '[training-license-on-a-work-machine-service]: Error submitting application to AOSH',
          error,
        )
        throw Error('Error submitting application to AOSH')
      })
  }
}

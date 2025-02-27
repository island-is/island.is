import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  MachineLicenseDto,
  MachineSubCategoryDto,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  getCleanApplicantInformation,
  getCleanCertificateOfTenure,
  getCleanCompanyInformation,
  getRecipient,
} from './training-license-on-a-work-machine.utils'
import { generateRequestReviewEmail } from './emailGenerators/requestReviewEmail'
import { generateRequestReviewSms } from './smsGenerators/requestReviewSms'
import { NotificationsService } from '../../../../notification/notifications.service'
import { NotificationType } from '../../../../notification/notificationsTemplates'
import { generateApplicationDeleteEmail } from './emailGenerators/applicationDeleteEmail'
import { generateApplicationDeleteSms } from './smsGenerators/applicationDeleteSms'
@Injectable()
export class TrainingLicenseOnAWorkMachineTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly workMachineClientService: WorkMachinesClientService,
    private readonly notificationsService: NotificationsService,
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
    if (
      !result ||
      !result.licenseCategories ||
      !result.licenseCategories.length
    ) {
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

  async getSubCategories({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<MachineSubCategoryDto[]> {
    const result = await this.workMachineClientService.getMachineSubCategories(
      auth,
      {
        xCorrelationID: application.id,
      },
    )
    if (!result || !result.length) {
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

  async initReview({
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    // Send email and sms
    const company = getCleanCompanyInformation(application)
    const recipient = getRecipient(company)
    if (company.contactEmail) {
      await this.sharedTemplateAPIService
        .sendEmail(
          (props) => generateRequestReviewEmail(props, recipient),
          application,
        )
        .catch((e) => {
          this.logger.error(
            `Error sending email about initReview in application: ID: ${application.id}`,
            e,
          )
        })
    }
    if (company.contactPhoneNumber) {
      await this.sharedTemplateAPIService
        .sendSms(
          (_, options) =>
            generateRequestReviewSms(application, options, recipient),
          application,
        )
        .catch((e) => {
          this.logger.error(
            `Error sending sms about initReview to 
                    a phonenumber in application: ID: ${application.id}`,
            e,
          )
        })
    }
  }

  async deleteApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    // Send email and sms
    const company = getCleanCompanyInformation(application)
    const recipient = getRecipient(company)
    if (company.contactEmail) {
      await this.sharedTemplateAPIService
        .sendEmail(
          (props) => generateApplicationDeleteEmail(props, recipient),
          application,
        )
        .catch((e) => {
          this.logger.error(
            `Error sending email about deleteApplication in application: ID: ${application.id}`,
            e,
          )
        })
    }
    if (company.contactPhoneNumber) {
      await this.sharedTemplateAPIService
        .sendSms((_) => generateApplicationDeleteSms(recipient), application)
        .catch((e) => {
          this.logger.error(
            `Error sending sms about deleteApplication to 
                    a phonenumber in application: ID: ${application.id}`,
            e,
          )
        })
    }
  }

  async rejectApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // Send Hnipp to applicant if company rejects application
    const applicantName =
      getValueViaPath<string>(
        application.externalData,
        'nationalRegistry.data.fullName',
      ) ?? ''
    this.notificationsService.sendNotification({
      type: NotificationType.TrainingLicenseOnWorkMachineRejected,
      messageParties: {
        recipient: auth.nationalId,
        sender: auth.nationalId,
      },
      args: {
        applicantName,
        applicationId: application.id,
      },
    })
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // Send Hnipp to applicant if they are not a contractor
    const isContractor = getValueViaPath<string[]>(
      application.answers,
      'assigneeInformation.isContractor',
    )
    if (!isContractor?.includes('yes')) {
      const applicantName =
        getValueViaPath<string>(
          application.externalData,
          'nationalRegistry.data.fullName',
        ) ?? ''
      this.notificationsService.sendNotification({
        type: NotificationType.TrainingLicenseOnWorkMachineApproved,
        messageParties: {
          recipient: auth.nationalId,
          sender: auth.nationalId,
        },
        args: {
          applicantName,
          applicationId: application.id,
        },
      })
    }
    // Submit application to AOSH
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
        throw new TemplateApiError(
          {
            title: 'Error submitting application',
            summary: 'There was an error submitting your application to AOSH',
          },
          500,
        )
      })
  }
}

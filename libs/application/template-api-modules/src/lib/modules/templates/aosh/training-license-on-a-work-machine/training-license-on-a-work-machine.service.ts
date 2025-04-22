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
  getCleanCompanyInformationList,
  getRecipient,
} from './training-license-on-a-work-machine.utils'
import { generateRequestReviewEmail } from './emailGenerators/requestReviewEmail'
import { generateRequestReviewSms } from './smsGenerators/requestReviewSms'
import { NotificationsService } from '../../../../notification/notifications.service'
import { NotificationType } from '../../../../notification/notificationsTemplates'
import { generateApplicationDeleteEmail } from './emailGenerators/applicationDeleteEmail'
import { generateApplicationDeleteSms } from './smsGenerators/applicationDeleteSms'
import { TrainingLicenseOnAWorkMachine } from '@island.is/application/templates/aosh/training-license-on-a-work-machine'
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
    const companyList = getCleanCompanyInformationList(application)

    for (const [index, company] of companyList.entries()) {
      const recipient = getRecipient(company)

      if (company.contactEmail) {
        try {
          await this.sharedTemplateAPIService.sendEmail(
            (props) => generateRequestReviewEmail(props, recipient),
            application,
          )
        } catch (e) {
          this.logger.error(
            `Error sending email about initReview in application: ID: ${application.id}, assignee: ${index}`,
            e,
          )
        }
      }

      if (company.contactPhoneNumber) {
        try {
          await this.sharedTemplateAPIService.sendSms(
            (_, options) =>
              generateRequestReviewSms(application, options, recipient),
            application,
          )
        } catch (e) {
          this.logger.error(
            `Error sending SMS about initReview to a phone number in application: ID: ${application.id}, assignee: ${index}`,
            e,
          )
        }
      }
    }
  }

  async deleteApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    const companyList = getCleanCompanyInformationList(application)

    for (const [index, company] of companyList.entries()) {
      const recipient = getRecipient(company)

      if (company.contactEmail) {
        try {
          await this.sharedTemplateAPIService.sendEmail(
            (props) => generateApplicationDeleteEmail(props, recipient),
            application,
          )
        } catch (e) {
          this.logger.error(
            `Error sending email about deleteApplication in application: ID: ${application.id} and assignee: ${index}`,
            e,
          )
        }
      }

      if (company.contactPhoneNumber) {
        try {
          await this.sharedTemplateAPIService.sendSms(
            (_) => generateApplicationDeleteSms(recipient),
            application,
          )
        } catch (e) {
          this.logger.error(
            `Error sending SMS about deleteApplication to a phone number in application: ID: ${application.id} and assignee: ${index}`,
            e,
          )
        }
      }
    }
  }

  async rejectApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    // Send Hnipp to applicant if company rejects application
    const applicantNationalId = getValueViaPath<string>(
      application.externalData,
      'identity.data.nationalId',
    )
    if (applicantNationalId) {
      await this.notificationsService.sendNotification({
        type: NotificationType.TrainingLicenseOnWorkMachineRejected,
        messageParties: {
          recipient: applicantNationalId,
        },
        applicationId: application.id,
      })
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    // Submit application to AOSH
    const applicant = getCleanApplicantInformation(application)
    const companiesWorkedFor = getCleanCompanyInformationList(application)
    const teachingLicenseMachineWorkedOnDtos =
      getCleanCertificateOfTenure(application)
    const certificateOfTenure = getValueViaPath<
      TrainingLicenseOnAWorkMachine['certificateOfTenure']
    >(application.answers, 'certificateOfTenure')
    await this.workMachineClientService
      .machineLicenseTeachingApplication(auth, {
        xCorrelationID: application.id,
        machineLicenseTeachingApplicationCreateDto: {
          applicant,
          companiesWorkedFor,
          licenseCategoryPrefix:
            certificateOfTenure?.[0].licenseCategoryPrefix ?? '',
          teachingLicenseMachineWorkedOnDtos,
        },
      })
      .catch((error) => {
        this.logger.error(
          '[training-license-on-a-work-machine-service]: Error submitting application to AOSH',
          error,
        )
        throw new TemplateApiError(
          {
            title: coreErrorMessages.defaultTemplateApiError,
            summary: coreErrorMessages.cantConnectToVer,
          },
          500,
        )
      })

    // Send Hnipp to applicant if they are not only a contractor

    const isNotOnlyContractor = certificateOfTenure?.some(
      ({ isContractor }) => !isContractor?.includes('yes'),
    )
    if (isNotOnlyContractor) {
      const applicantNationalId = getValueViaPath<string>(
        application.externalData,
        'identity.data.nationalId',
      )
      if (applicantNationalId) {
        await this.notificationsService.sendNotification({
          type: NotificationType.TrainingLicenseOnWorkMachineApproved,
          messageParties: {
            recipient: applicantNationalId,
          },
          applicationId: application.id,
        })
      }
    }
  }
}

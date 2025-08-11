import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ActivationGrantCreateActivationGrantRequest,
  GaldurDomainModelsApplicationsActivationGrantApplicationsViewModelsActivationGrantViewModel,
  VmstUnemploymentClientService,
} from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../types'
import { Locale } from '@island.is/shared/types'
import {
  getAcademicInfo,
  getApplicantInfo,
  getBankInfo,
  getContactInfo,
  getCVInfo,
  getJobHistoryInfo,
  getJobWishesInfo,
  getLanguageInfo,
  getLicenseInfo,
  getStartingLocale,
} from './activation-allowance.utils'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { errorMsgs } from '@island.is/application/templates/activation-allowance'
import { S3Service } from '@island.is/nest/aws'
import { sharedModuleConfig } from '../../shared'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class ActivationAllowanceService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
    private readonly s3Service: S3Service,
    @Inject(sharedModuleConfig.KEY)
    private config: ConfigType<typeof sharedModuleConfig>,
  ) {
    super(ApplicationTypes.ACTIVATION_ALLOWANCE)
  }

  getStartingLocale({
    currentUserLocale,
  }: TemplateApiModuleActionProps): Locale {
    return currentUserLocale
  }

  async createApplication({
    auth,
  }: TemplateApiModuleActionProps): Promise<GaldurDomainModelsApplicationsActivationGrantApplicationsViewModelsActivationGrantViewModel> {
    try {
      const application =
        await this.vmstUnemploymentClientService.getEmptyActivationGrantApplication(
          auth,
        )

      if (!application.canApply) {
        this.logger.warn(
          '[VMST-ActivationAllowance]: User cannot apply, creating application returned canApply: False',
          application.errorMessage,
        )
        throw new TemplateApiError(
          {
            title: errorMsgs.cannotApplyErrorTitle,
            summary: errorMsgs.cannotApplyErrorSummary,
          },
          400,
        )
      }

      if (!application.success) {
        this.logger.error(
          '[VMST-ActivationAllowance]: Creating application returned success: False',
          application.errorMessage,
        )
        throw new TemplateApiError(
          {
            title: errorMsgs.successErrorTitle,
            summary: errorMsgs.successErrorSummary,
          },
          500,
        )
      }
      return application
    } catch (error) {
      if (error instanceof TemplateApiError) {
        throw error
      }

      throw new Error(error)
    }
  }

  async submitApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { answers, externalData } = application
    const personalInfo = getApplicantInfo(answers, externalData)
    const contact = getContactInfo(answers)
    const licenses = getLicenseInfo(answers)
    const jobWishesPayload = getJobWishesInfo(answers)
    const jobHistoryPayload = getJobHistoryInfo(answers)
    const bankInfo = getBankInfo(answers, externalData)
    const languageSkillInfo = getLanguageInfo(answers, externalData)
    const education = getAcademicInfo(answers)
    const startingLocale = getStartingLocale(externalData)
    const cvInfo = await getCVInfo(
      answers,
      this.s3Service,
      application.id,
      this.config.templateApi.attachmentBucket,
    )

    if (!bankInfo) {
      this.logger.warn(
        '[VMST-ActivationAllowance]: Missing payment information fields',
      )
      throw new Error()
    } else if (!languageSkillInfo) {
      this.logger.warn(
        '[VMST-ActivationAllowance]: Missing language skills information fields',
      )
      throw new Error()
    } else if (!personalInfo) {
      this.logger.warn(
        '[VMST-ActivationAllowance]: Missing personal information fields',
      )
      throw new Error()
    }

    let cvResponse
    if (cvInfo) {
      cvResponse =
        await this.vmstUnemploymentClientService.createAttachmentForActivationGrant(
          {
            galdurDomainModelsAttachmentsCreateAttachmentRequest: {
              attachmentTypeId: 'B1595806-8F7F-450C-B999-08D681E727D5',
              fileName: cvInfo?.fileName,
              fileType: cvInfo?.fileType,
              data: cvInfo?.data,
            },
          },
        )
    }

    const payload: ActivationGrantCreateActivationGrantRequest = {
      galdurApplicationApplicationsActivationGrantsCommandsCreateActivationGrantCreateActivationGrantCommand:
        {
          activationGrant: {
            applicationInformation: {
              applicationLanguage: startingLocale?.toUpperCase() || 'IS',
              additionalInformation: cvInfo?.other,
              contactConnection: contact?.connection,
              contactEmail: contact?.email,
              contactName: contact?.name,
              contactPhoneNumber: contact?.email,
            },
            personalInformation: personalInfo,
            otherInformation: {
              canStartAt: new Date(),
            },
            preferredJobs: {
              jobs: jobWishesPayload,
            },
            educationHistory: {
              education: education,
            },
            jobCareer: {
              jobs: jobHistoryPayload,
            },
            drivingLicense: licenses,
            attachments: {
              files: !cvResponse ? [] : [{ id: cvResponse?.attachment?.id }],
            },
            bankingPensionUnion: bankInfo,
            languageKnowledge: {
              languages: languageSkillInfo,
            },
            applicantId: null,
          },
          save: true,
          finalize: true,
        },
    }

    try {
      const response =
        await this.vmstUnemploymentClientService.submitActivationGrantApplication(
          payload,
        )
      if (!response.success)
        throw new Error(
          response?.errorMessage ||
            'Response unsuccessfull and missing errorMsg',
        )
    } catch (e) {
      throw new Error(e)
    }
  }
}

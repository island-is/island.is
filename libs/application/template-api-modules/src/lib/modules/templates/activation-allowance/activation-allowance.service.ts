import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ActivationGrantCreateActivationGrantRequest,
  GaldurDomainModelsApplicationsActivationGrantActivationGrantDTO,
  GaldurDomainModelsApplicationsActivationGrantApplicationsViewModelsActivationGrantViewModel,
  GaldurDomainModelsAttachmentsAttachmentViewModel,
  VmstUnemploymentClientService,
} from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../types'
import { Locale } from '@island.is/shared/types'
import {
  getAcademicInfo,
  getApplicantInfo,
  getBankInfo,
  getCanStartAt,
  getContactInfo,
  getCVInfo,
  getIncome,
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
import { getValueViaPath, YES } from '@island.is/application/core'
import { CV_ID } from './constants'

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
    currentUserLocale,
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
            summary:
              currentUserLocale === 'en'
                ? application.userMessageEN || errorMsgs.cannotApplyErrorSummary
                : application.userMessageIS ||
                  errorMsgs.cannotApplyErrorSummary,
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
    const incomeInfo = getIncome(answers, externalData)
    const cvInfo = await getCVInfo(
      answers,
      this.s3Service,
      application.id,
      this.config.templateApi.attachmentBucket,
    )
    const canStartAt = getCanStartAt(answers)
    const hasCV = getValueViaPath<string | undefined>(answers, 'cv.haveCV')
    const emptyApplicationOriginal =
      getValueViaPath<GaldurDomainModelsApplicationsActivationGrantActivationGrantDTO>(
        externalData,
        'activityGrantApplication.data.activationGrant',
      )

    const emptyApplication = { ...emptyApplicationOriginal }
    delete emptyApplication.supportData

    let hasError = false
    if (!bankInfo) {
      this.logger.warn(
        '[VMST-ActivationAllowance]: Missing payment information fields',
      )
      hasError = true
    }
    if (!languageSkillInfo) {
      this.logger.warn(
        '[VMST-ActivationAllowance]: Missing language skills information fields',
      )
      hasError = true
    }
    if (!personalInfo) {
      this.logger.warn(
        '[VMST-ActivationAllowance]: Missing personal information fields',
      )
      hasError = true
    }

    if (hasError) {
      throw new Error('Missing required fields')
    }

    let cvResponse: GaldurDomainModelsAttachmentsAttachmentViewModel | undefined
    if (cvInfo) {
      cvResponse =
        await this.vmstUnemploymentClientService.createAttachmentForActivationGrant(
          {
            galdurDomainModelsAttachmentsCreateAttachmentRequest: {
              attachmentTypeId: CV_ID,
              fileName: cvInfo?.fileName,
              fileType: cvInfo?.fileType,
              data: cvInfo?.data,
            },
          },
        )
      if (!cvResponse.success) {
        throw new Error(cvResponse.errorMessage || 'creating attachment failed')
      }
    }

    const payload: ActivationGrantCreateActivationGrantRequest = {
      galdurApplicationApplicationsActivationGrantsCommandsCreateActivationGrantCreateActivationGrantCommand:
        {
          activationGrant: {
            applicationInformation: {
              ...emptyApplication?.applicationInformation,
              created: new Date(
                emptyApplication?.applicationInformation?.created || '',
              ),
              applicationLanguage: startingLocale?.toUpperCase() || 'IS',
              additionalInformation: cvInfo?.other,
              contactConnection: contact?.connection,
              contactEmail: contact?.email,
              contactName: contact?.name,
              contactPhoneNumber: contact?.phone,
              incomes: incomeInfo,
              hasCV: hasCV === YES ? true : false,
            },
            personalInformation: {
              ...personalInfo,
            },
            otherInformation: {
              ...emptyApplication?.otherInformation,
              canStartAt,
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
            bankingPensionUnion: {
              ...emptyApplication?.bankingPensionUnion,
              ...bankInfo,
            },
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

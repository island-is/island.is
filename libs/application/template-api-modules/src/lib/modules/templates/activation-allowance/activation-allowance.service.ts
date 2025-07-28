import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
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
  getJobHistoryInfo,
  getJobWishesInfo,
  getLanguageInfo,
  getLicenseInfo,
  getSupportData,
} from './activation-allowance.utils'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class ActivationAllowanceService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.ACTIVATION_ALLOWANCE)
  }
  // TODO: Implement functions as needed

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
        throw new TemplateApiError(
          {
            title: 'Cannot apply, [replace witih contentful msg]',
            summary: 'Cannot apply, [replace witih contentful msg]',
          },
          400,
        )
      }
      // TODO canApply check this...
      return application
    } catch (error) {
      // TODO Inject logger and log
      throw new Error(error)
    }
  }

  async submitApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { answers, externalData } = application
    const personalInfo = getApplicantInfo(answers)
    const contact = getContactInfo(answers)
    const licenses = getLicenseInfo(answers)
    const jobWishesPayload = getJobWishesInfo(answers)
    const jobHistoryPayload = getJobHistoryInfo(answers)
    const bankInfo = getBankInfo(answers, externalData)
    const languageSkillInfo = getLanguageInfo(answers, externalData)
    //const supportData = getSupportData(externalData)
    const education = getAcademicInfo(answers)

    if (!bankInfo) {
      this.logger.warn(
        '[VMST-ActivationAllowance]: Missing payment information fields',
      )
      throw new Error() // TODO Better error or template api error
    } else if (!languageSkillInfo) {
      this.logger.warn(
        '[VMST-ActivationAllowance]: Missing language skills information fields',
      )
      throw new Error() // TODO Better error or template api error
    }
    //  else if (!personalInfo) {
    //   this.logger.warn(
    //     '[VMST-ActivationAllowance]: Missing personal information fields',
    //   )
    //   throw new Error() // TODO Better error or template api error
    // }

    const payload = {
      galdurApplicationApplicationsActivationGrantsCommandsCreateActivationGrantCreateActivationGrantCommand:
        {
          activationGrant: {
            applicationInformation: {
              applicationLanguage: 'IS',
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
              files: [
                {
                  // Need anwers here, attachmentTypeId vs contentType vs attachmentTypeName
                },
              ],
              //currentFiles: {} What is this ?
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

    //console.log('PAYLOAD', payload)
    try {
      const response =
        await this.vmstUnemploymentClientService.submitActivationGrantApplication(
          payload,
        )
      console.log('RESPONSIBLEEE', response)
    } catch (e) {
      console.log('IN CATCH')
      throw new Error(e)
    }

    throw new Error('I threw this error')
    return Promise.resolve()
  }
}

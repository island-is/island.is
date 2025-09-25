import { Injectable, Inject } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  GaldurDomainModelsApplicantsApplicantProfileDTOsElectronicCommunication,
  GaldurDomainModelsApplicantsApplicantProfileDTOsPersonalInformation,
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsOtherInformationDTO,
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemploymentApplicationAccess,
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemploymentApplicationInformation,
  GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationDto,
  GaldurDomainModelsSettingsJobCodesJobCodeDTO,
  UnemploymentApplicationCreateUnemploymentApplicationRequest,
  VmstUnemploymentClientService,
} from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'
import { sharedModuleConfig } from '../../shared'
import { getValueViaPath, YES } from '@island.is/application/core'
import { ConfigType } from '@nestjs/config'
import {
  getAttachmentObjects,
  getBankinPensionUnion,
  getEducationalQuestions,
  getEducationInformation,
  getEmployerSettlement,
  getFileInfo,
  getJobCareer,
  getJobWishes,
  getJobWishList,
  getLanguageSkills,
  getLicenseInformation,
  getPersonalInformation,
  getPersonalTaxCredit,
  getPreviousOccupationInformation,
  getSupportedChildren,
} from './unemployment-benefits.utils'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  errorMsgs,
  FileSchemaInAnswers,
} from '@island.is/application/templates/unemployment-benefits'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { S3Service } from '@island.is/nest/aws'
import { FileResponse, FileResponseWithType } from './types'

@Injectable()
export class UnemploymentBenefitsService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly s3Service: S3Service,
    @Inject(sharedModuleConfig.KEY)
    private config: ConfigType<typeof sharedModuleConfig>,
  ) {
    super(ApplicationTypes.UNEMPLOYMENT_BENEFITS)
  }

  getStartingLocale({
    currentUserLocale,
  }: TemplateApiModuleActionProps): Locale {
    return currentUserLocale
  }

  async getEmptyApplication({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationDto | null> {
    const results =
      await this.vmstUnemploymentClientService.getEmptyApplication(auth)

    const types = this.vmstUnemploymentClientService.getAttachmentTypes()
    console.log('types', types)
    if (!results.canApply) {
      this.logger.warn(
        '[VMST-ActivationAllowance]: User cannot apply, creating application returned canApply: False',
        results.errorMessage,
      )
      throw new TemplateApiError(
        {
          title: errorMsgs.cannotApplyErrorTitle,
          summary:
            currentUserLocale === 'en'
              ? results.userMessageEN || errorMsgs.cannotApplyErrorSummary
              : results.userMessageIS || errorMsgs.cannotApplyErrorSummary,
        },
        400,
      )
    }
    return results.unemploymentApplication || null
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { answers, externalData } = application

    const jobCodes =
      getValueViaPath<GaldurDomainModelsSettingsJobCodesJobCodeDTO[]>(
        application.externalData,
        'unemploymentApplication.data.supportData.jobCodes',
      ) ?? []

    //unchanged:
    // applicationInformation
    // applicationAccess
    //electronicCommunication
    const applicationInformation =
      getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemploymentApplicationInformation>(
        application.externalData,
        'unemploymentApplication.data.applicationInformation',
        {},
      )
    const applicationAccess =
      getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnemploymentApplicationAccess>(
        application.externalData,
        'unemploymentApplication.data.applicationAccess',
        {},
      )

    const electronicCommunication =
      getValueViaPath<GaldurDomainModelsApplicantsApplicantProfileDTOsElectronicCommunication>(
        application.externalData,
        'unemploymentApplication.data.electronicCommunication',
        {},
      )

    //personalInformation
    const personalInformationFromService =
      getValueViaPath<GaldurDomainModelsApplicantsApplicantProfileDTOsPersonalInformation>(
        application.externalData,
        'unemploymentApplication.data.personalInformation',
        {},
      )

    const personalInformationFromAnswers = getPersonalInformation(answers)

    const personalInformation = {
      ...personalInformationFromService,
      ...personalInformationFromAnswers,
    }

    //Other information
    const otherInformationFromService =
      getValueViaPath<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsOtherInformationDTO>(
        application.externalData,
        'unemploymentApplication.data.otherInformation',
        {},
      )

    const otherInformationFromAnswers = getJobWishes(answers)
    const otherInformation = {
      ...otherInformationFromService,
      ...otherInformationFromAnswers,
    }

    // preferredJobs
    const preferredJobsFromAnswers = getJobWishList(answers, jobCodes)

    //educationHistory
    const educationInformation = getEducationInformation(answers)

    //jobCareer
    const jobCareer = getJobCareer(answers, jobCodes)

    //drivingLicense
    const licenseInformation = getLicenseInformation(answers)

    //attachments
    const attachmentList: Array<FileResponseWithType> = []
    // Læknistvottorð - ástæða atvinnuleitar
    const medicalCertificateFile =
      getValueViaPath<Array<FileSchemaInAnswers>>(
        answers,
        'reasonForJobSearch.healthReason',
        [],
      ) ?? []
    medicalCertificateFile.map(async (file) => {
      const attachment = await getFileInfo(
        this.s3Service,
        application.id,
        this.config.templateApi.attachmentBucket,
        file,
      )
      if (attachment) attachmentList.push({ type: '', file: attachment })
    })
    // Staðfesting á námi/prófgráðu - menntun
    // starfhæfnisvottorð - vinnufærni - answers.
    // staðfsting á sjúkradagpeningum - aðrar bætur og lífeyrir
    // staðfesting á greiðsluáætlun - aðrar bætur og lífeyrir
    // ferilskrá - ferilskrá

    //childrenSupported
    const childrenSupported = getSupportedChildren(answers)

    //bankingPensionUnion

    const bankingPensionUnion = getBankinPensionUnion(answers, externalData)

    //personalTaxCredit
    const personalTaxCredit = getPersonalTaxCredit(answers)

    //employerSettlement

    const employerSettlement = getEmployerSettlement(answers)

    //languageKnowledge
    const languageKnowledge = getLanguageSkills(answers, externalData)

    //workingCapacity
    const workingCapacity = {
      capacityId: getValueViaPath<string>(answers, 'workingAbility.status'),
    }

    //pensionAndOtherPayments
    const pensionAndOtherPayments = {
      //TODO finish this page first
    }

    //previousOccupation
    const previousOccupation = getPreviousOccupationInformation(
      answers,
      externalData,
    )

    //jobStatus
    const jobStatus = {
      jobType: 1, // TODO map to hardcoded values from odinn
    }

    //euresInformation
    const euresInformation = {
      showOnEures:
        getValueViaPath<string>(answers, 'euresJobSearch.agreement') === YES,
    }

    //educationalQuestions
    const educationalQuestions = getEducationalQuestions(answers)

    // throw new Error('dont work please')

    //submit attachments
    // const attachmentObjectsWithType = getAttachmentObjects(attachmentList)

    const submitResponse: UnemploymentApplicationCreateUnemploymentApplicationRequest =
      {
        galdurApplicationApplicationsUnemploymentApplicationsCommandsCreateUnemploymentApplicationCreateUnemploymentApplicationCommand:
          {
            unemploymentApplication: {
              applicationInformation: applicationInformation,
              applicationAccess: applicationAccess,
              personalInformation: personalInformation,
              electronicCommunication: electronicCommunication,
              otherInformation: otherInformation,
              preferredJobs: preferredJobsFromAnswers,
              educationHistory: educationInformation,
              jobCareer: jobCareer,
              drivingLicense: licenseInformation,
              //attachments
              childrenSupported: childrenSupported,
              bankingPensionUnion: bankingPensionUnion,
              personalTaxCredit: personalTaxCredit,
              employerSettlement: employerSettlement,
              languageKnowledge: languageKnowledge,
              workingCapacity: workingCapacity,
              pensionAndOtherPayments: pensionAndOtherPayments,
              previousOccupation: previousOccupation,
              jobStatus: jobStatus,
              euresInformation: euresInformation,
              educationalQuestions: educationalQuestions,
              applicantId: null,
            },
            save: true,
            finalize: true,
          },
      }
    this.vmstUnemploymentClientService.submitApplication(auth, submitResponse)
  }
}

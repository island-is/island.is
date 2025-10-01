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
import { FileTypeIds } from './constants'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  errorMsgs,
  FileSchemaInAnswers,
  EducationInAnswers,
  WorkingAbilityInAnswers,
  OtherBenefitsInAnswers,
  ResumeInAnswers,
  PaymentTypeIds,
  EducationType,
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
    medicalCertificateFile.forEach(async (file) => {
      const attachment = await getFileInfo(
        this.s3Service,
        application.id,
        this.config.templateApi.attachmentBucket,
        file,
      )
      if (attachment)
        attachmentList.push({
          type: FileTypeIds.MEDICAL_CERTIFICATE_RESIGNATION,
          file: attachment,
        })
    })
    // Staðfesting á námi/prófgráðu - menntun
    const educationAnswers = getValueViaPath<EducationInAnswers>(
      answers,
      'education',
    )
    educationAnswers?.currentEducation?.degreeFile?.forEach(async (file) => {
      const attachment = await getFileInfo(
        this.s3Service,
        application.id,
        this.config.templateApi.attachmentBucket,
        file,
      )

      let fileTypeId
      if (educationAnswers.typeOfEducation === EducationType.LAST_YEAR) {
        fileTypeId = FileTypeIds.SCHOOL_CONFIRMATION_FINISHED_LAST_TWELVE
      }
      if (educationAnswers.typeOfEducation === EducationType.CURRENT) {
        fileTypeId = FileTypeIds.SCHOOL_CONFIRMATION_REGISTERED_NOW
      }
      //only option left is LAST_SEMESTER
      else {
        if (educationAnswers.didFinishLastSemester === YES) {
          fileTypeId = FileTypeIds.SCHOOL_CONFIRMATION_FINISHED_WITH_DEGREE
        } else {
          fileTypeId = FileTypeIds.SCHOOL_CONFIRMATION_REGISTERED_LAST_SEMESTER
        }
      }

      if (attachment)
        attachmentList.push({
          type: fileTypeId,
          file: attachment,
        })
    })
    // starfhæfnisvottorð - vinnufærni - answers.
    const workingAbility = getValueViaPath<WorkingAbilityInAnswers>(
      answers,
      'workingAbility',
    )
    workingAbility?.medicalReport?.forEach(async (file) => {
      const attachment = await getFileInfo(
        this.s3Service,
        application.id,
        this.config.templateApi.attachmentBucket,
        file,
      )
      if (attachment)
        attachmentList.push({
          type: FileTypeIds.JOB_ABILITY_CERTIFICATE,
          file: attachment,
        })
    })

    // staðfsting á sjúkradagpeningum - aðrar bætur og lífeyrir
    // staðfesting á greiðsluáætlun - aðrar bætur og lífeyrir
    const otherBenefits = getValueViaPath<OtherBenefitsInAnswers>(
      answers,
      'otherBenefits',
    )
    otherBenefits?.payments?.forEach((payments) => {
      payments.sicknessAllowanceFile?.forEach(async (file) => {
        const attachment = await getFileInfo(
          this.s3Service,
          application.id,
          this.config.templateApi.attachmentBucket,
          file,
        )
        if (attachment)
          attachmentList.push({
            type: FileTypeIds.SICKNESS_BENEFIT_PAYMENTS,
            file: attachment,
          })
      })

      payments.paymentPlanFile?.map(async (file) => {
        const attachment = await getFileInfo(
          this.s3Service,
          application.id,
          this.config.templateApi.attachmentBucket,
          file,
        )
        if (attachment)
          attachmentList.push({
            type: FileTypeIds.PAYMENT_PLAN,
            file: attachment,
          })
      })
    })

    // ferilskrá - ferilskrá
    const resume = getValueViaPath<ResumeInAnswers>(answers, 'resume')
    resume?.resumeFile?.forEach(async (file) => {
      const attachment = await getFileInfo(
        this.s3Service,
        application.id,
        this.config.templateApi.attachmentBucket,
        file,
      )
      if (attachment)
        attachmentList.push({
          type: FileTypeIds.CV,
          file: attachment,
        })
    })

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
      capacityId: getValueViaPath<WorkingAbilityInAnswers>(
        answers,
        'workingAbility',
      )?.status,
    }

    //pensionAndOtherPayments
    const pensionAndOtherPayments =
      otherBenefits?.receivingBenefits === YES
        ? {
            wellfarePayments: otherBenefits.payments
              ?.filter(
                (x) =>
                  x.typeOfPayment === PaymentTypeIds.INSURANCE_PAYMENTS_TYPE_ID,
              )
              .map((payment) => {
                return {
                  incomeTypeId: payment.subType,
                  periodFrom: payment.dateFrom
                    ? new Date(payment.dateFrom)
                    : null,
                  periodTo: payment.dateTo ? new Date(payment.dateTo) : null,
                  estimatedIncome: parseInt(payment.paymentAmount || ''),
                  realIncome: parseInt(payment.paymentAmount || ''),
                }
              }),
            pensionPayments: otherBenefits.payments
              ?.filter(
                (x) => x.typeOfPayment === PaymentTypeIds.PENSION_FUND_TYPE_ID,
              )
              .map((payment) => {
                return {
                  incomeTypeId: payment.subType,
                  estimatedIncome: parseInt(payment.paymentAmount || ''),
                  realIncome: parseInt(payment.paymentAmount || ''),
                  pensionFundId: payment.pensionFund,
                }
              }),
            privatePensionPayments: otherBenefits.payments
              ?.filter(
                (x) =>
                  x.typeOfPayment === PaymentTypeIds.SUPPLEMENTARY_FUND_TYPE_ID,
              )
              .map((payment) => {
                return {
                  incomeTypeId: payment.subType,
                  estimatedIncome: parseInt(payment.paymentAmount || ''),
                  realIncome: parseInt(payment.paymentAmount || ''),
                  privatePensionFundId: payment.pensionFund,
                }
              }),
            // TODO NEED FIELD TO RETURN SJUKRADAGPENINGAR
          }
        : null

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

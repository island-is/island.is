import { Injectable, Inject } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsOtherInformationDTO,
  GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationDto,
  GaldurDomainModelsAttachmentsAttachmentViewModel,
  GaldurDomainModelsAttachmentsCreateAttachmentRequest,
  GaldurDomainModelsSettingsJobCodesJobCodeDTO,
  UnemploymentApplicationCreateUnemploymentApplicationRequest,
  VmstUnemploymentClientService,
} from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'
import { sharedModuleConfig } from '../../shared'
import { getValueViaPath, YES } from '@island.is/application/core'
import { ConfigType } from '@nestjs/config'
import {
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
  getPensionAndOtherPayments,
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
  EducationType,
  EmploymentStatus,
  EmploymentStatusIds,
} from '@island.is/application/templates/unemployment-benefits'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { S3Service } from '@island.is/nest/aws'

@Injectable()
export class UnemploymentBenefitsService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
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

    if (!results.canApply) {
      this.logger.warn(
        '[VMST-Unemployment]: User cannot apply, creating application returned canApply: False',
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

    /* 
      The following fields are updated with answers from the application, and we need to merge them with the data from the api:
    */

    //personalInformation
    const personalInformationFromAnswers = getPersonalInformation(answers)

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
    const attachmentList: Array<GaldurDomainModelsAttachmentsCreateAttachmentRequest> =
      []

    const attachmentPromises: Promise<void>[] = []

    const safeGetFileInfo = async (
      file: FileSchemaInAnswers,
      attachmentTypeId: string,
    ) => {
      try {
        const attachment = await getFileInfo(
          this.s3Service,
          application.id,
          this.config.templateApi.attachmentBucket,
          file,
        )

        if (attachment) {
          attachmentList.push({
            attachmentTypeId,
            fileName: attachment.fileName,
            fileType: attachment.fileType,
            data: attachment.data,
          })
        }
      } catch (error) {
        console.error('Error fetching file info:', error, file)
        throw new TemplateApiError(
          {
            title: errorMsgs.errorUploadingFile,
            summary: errorMsgs.errorUploadingFile,
          },
          400,
        )
      }
    }

    // Læknistvottorð - ástæða atvinnuleitar
    const medicalCertificateFiles =
      getValueViaPath<Array<FileSchemaInAnswers>>(
        answers,
        'reasonForJobSearch.healthReason',
        [],
      ) ?? []

    medicalCertificateFiles.forEach((file) => {
      attachmentPromises.push(
        safeGetFileInfo(file, FileTypeIds.MEDICAL_CERTIFICATE_RESIGNATION),
      )
    })

    // Staðfesting á námi/prófgráðu - menntun
    const educationAnswers = getValueViaPath<EducationInAnswers>(
      answers,
      'education',
    )
    educationAnswers?.currentEducation?.degreeFile?.forEach((file) => {
      let fileTypeId: string

      // We need to return a specific type of file depending on how the user answered the education questions
      if (educationAnswers.typeOfEducation === EducationType.LAST_YEAR) {
        fileTypeId = FileTypeIds.SCHOOL_CONFIRMATION_FINISHED_LAST_TWELVE
      } else if (educationAnswers.typeOfEducation === EducationType.CURRENT) {
        fileTypeId = FileTypeIds.SCHOOL_CONFIRMATION_REGISTERED_NOW
      } else {
        // only option left is LAST_SEMESTER
        if (educationAnswers.didFinishLastSemester === YES) {
          fileTypeId = FileTypeIds.SCHOOL_CONFIRMATION_FINISHED_WITH_DEGREE
        } else {
          fileTypeId = FileTypeIds.SCHOOL_CONFIRMATION_REGISTERED_LAST_SEMESTER
        }
      }

      attachmentPromises.push(safeGetFileInfo(file, fileTypeId))
    })

    // starfhæfnisvottorð - vinnufærni - answers.
    const workingAbility = getValueViaPath<WorkingAbilityInAnswers>(
      answers,
      'workingAbility',
    )
    workingAbility?.medicalReport?.forEach((file) => {
      attachmentPromises.push(
        safeGetFileInfo(file, FileTypeIds.JOB_ABILITY_CERTIFICATE),
      )
    })

    // staðfsting á sjúkradagpeningum - aðrar bætur og lífeyrir
    // staðfesting á greiðsluáætlun - aðrar bætur og lífeyrir
    const otherBenefits = getValueViaPath<OtherBenefitsInAnswers>(
      answers,
      'otherBenefits',
    )
    otherBenefits?.payments?.forEach((payments) => {
      payments.sicknessAllowanceFile?.forEach((file) => {
        attachmentPromises.push(
          safeGetFileInfo(file, FileTypeIds.SICKNESS_BENEFIT_PAYMENTS),
        )
      })

      payments.paymentPlanFile?.forEach((file) => {
        attachmentPromises.push(safeGetFileInfo(file, FileTypeIds.PAYMENT_PLAN))
      })
    })

    // ferilskrá - ferilskrá
    const resume = getValueViaPath<ResumeInAnswers>(answers, 'resume')
    resume?.resumeFile?.forEach((file) => {
      attachmentPromises.push(safeGetFileInfo(file, FileTypeIds.CV))
    })

    await Promise.all(attachmentPromises)

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
    const pensionAndOtherPayments = otherBenefits
      ? getPensionAndOtherPayments(otherBenefits)
      : undefined

    //previousOccupation
    const previousOccupation = getPreviousOccupationInformation(
      answers,
      externalData,
    )

    //jobStatus
    const employmentStatusFromAnswers =
      getValueViaPath<EmploymentStatus>(
        answers,
        'currentSituation.employmentStatus',
      ) || EmploymentStatus.UNEMPLOYED
    const jobStatus = {
      jobType: EmploymentStatusIds[employmentStatusFromAnswers],
    }

    //euresInformation
    const euresInformation = {
      showOnEures:
        getValueViaPath<string>(answers, 'euresJobSearch.agreement') === YES,
    }

    //educationalQuestions
    const educationalQuestions = getEducationalQuestions(answers)

    const submitAttachment = async (
      file: GaldurDomainModelsAttachmentsCreateAttachmentRequest,
    ): Promise<
      GaldurDomainModelsAttachmentsAttachmentViewModel | undefined
    > => {
      try {
        const res =
          await this.vmstUnemploymentClientService.createAttachmentForApplication(
            {
              galdurDomainModelsAttachmentsCreateAttachmentRequest: {
                attachmentTypeId: file.attachmentTypeId,
                fileName: file?.fileName,
                fileType: file?.fileType,
                data: file?.data,
              },
            },
          )
        if (!res.success) {
          throw new TemplateApiError(
            {
              title: res.errorMessage
                ? res.errorMessage
                : errorMsgs.errorUploadingFile,
              summary: res.errorMessage
                ? res.errorMessage
                : errorMsgs.errorUploadingFile,
            },
            400,
          )
        }
        return res
      } catch (error) {
        console.error('Error fetching file info:', error, file)
        throw new TemplateApiError(
          {
            title: errorMsgs.errorUploadingFile,
            summary: errorMsgs.errorUploadingFile,
          },
          400,
        )
      }
    }

    const submitAttachmentPromises: Promise<
      GaldurDomainModelsAttachmentsAttachmentViewModel | undefined
    >[] = []
    let successfullAttachments = []

    attachmentList.forEach((attachment) => {
      submitAttachmentPromises.push(submitAttachment(attachment))
    })

    successfullAttachments = await Promise.all(submitAttachmentPromises)

    const submitResponse: UnemploymentApplicationCreateUnemploymentApplicationRequest =
      {
        galdurApplicationApplicationsUnemploymentApplicationsCommandsCreateUnemploymentApplicationCreateUnemploymentApplicationCommand:
          {
            unemploymentApplication: {
              personalInformation: personalInformationFromAnswers,
              otherInformation: otherInformation,
              preferredJobs: preferredJobsFromAnswers,
              educationHistory: educationInformation,
              jobCareer: jobCareer,
              drivingLicense: licenseInformation,
              attachments: {
                files: successfullAttachments.map((x) => {
                  return { id: x?.attachment?.id }
                }),
              },
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
    const response = await this.vmstUnemploymentClientService.submitApplication(
      auth,
      submitResponse,
    )

    if (!response.success) {
      this.logger.error(
        '[VMST-Unemployment]: Failed to submit application',
        response.errorMessage,
      )
      throw new TemplateApiError(
        {
          title: errorMsgs.submitError,
          summary: response.errorMessage || errorMsgs.submitError,
        },
        400,
      )
    }
  }
}

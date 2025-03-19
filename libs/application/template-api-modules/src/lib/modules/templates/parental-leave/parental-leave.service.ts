import { Inject, Injectable } from '@nestjs/common'
import { S3Service } from '@island.is/nest/aws'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import {
  ADOPTION,
  ChildInformation,
  FileType,
  OTHER_NO_CHILDREN_FOUND,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  PERMANENT_FOSTER_CARE,
  ParentalRelations,
  SINGLE,
  States,
  UnEmployedBenefitTypes,
  calculateDaysUsedByPeriods,
  calculatePeriodLength,
  getAdditionalSingleParentRightsInDays,
  getApplicationAnswers,
  getApplicationExternalData,
  getAvailablePersonalRightsInDays,
  getMultipleBirthsDays,
  getSelectedChild,
  getTransferredDays,
  getTransferredDaysInMonths,
  getUnApprovedEmployers,
  isParentWithoutBirthParent,
  Period as AnswerPeriod,
  getPersonalDays,
  getPersonalDaysInMonths,
  StartDateOptions,
  getAdditionalSingleParentRightsInMonths,
  clamp,
  getMultipleBirthsDaysInMonths,
  Files,
} from '@island.is/application/templates/parental-leave'
import {
  Application,
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/types'
import type {
  ApplicationRights,
  Attachment,
  Period,
} from '@island.is/clients/vmst'
import {
  ApplicationInformationApi,
  ParentalLeaveApi,
} from '@island.is/clients/vmst'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { ConfigService, ConfigType } from '@nestjs/config'
import {
  SharedModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService, sharedModuleConfig } from '../../shared'
import { getConfigValue } from '../../shared/shared.utils'
import { ChildrenService } from './children/children.service'
import {
  SIX_MONTHS_IN_SECONDS_EXPIRES,
  apiConstants,
  rightsDescriptions,
} from './constants'
import {
  generateApplicationApprovedByEmployerEmail,
  generateApplicationApprovedByEmployerToEmployerEmail,
  generateAssignEmployerApplicationEmail,
  generateAssignOtherParentApplicationEmail,
  generateEmployerRejected,
  generateOtherParentRejected,
} from './emailGenerators'
import {
  getType,
  checkIfPhoneNumberIsGSM,
  getRightsCode,
  transformApplicationToParentalLeaveDTO,
  getFromDate,
  isFixedRight,
} from './parental-leave.utils'
import {
  generateAssignEmployerApplicationSms,
  generateAssignOtherParentApplicationSms,
  generateEmployerRejectedApplicationSms,
  generateOtherParentRejectedApplicationSms,
} from './smsGenerators'
import parseISO from 'date-fns/parseISO'

interface VMSTError {
  type: string
  title: string
  status: number
  traceId: string
  errors: Record<string, string[]>
}

@Injectable()
export class ParentalLeaveService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private parentalLeaveApi: ParentalLeaveApi,
    private applicationInformationAPI: ApplicationInformationApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(sharedModuleConfig.KEY)
    private config: ConfigType<typeof sharedModuleConfig>,
    private readonly configService: ConfigService<SharedModuleConfig>,
    private readonly childrenService: ChildrenService,
    private readonly nationalRegistryApi: NationalRegistryClientService,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.PARENTAL_LEAVE)
  }

  private parseErrors(e: Error | VMSTError) {
    if (e instanceof Error) {
      return e.message
    }

    return {
      message: e.errors
        ? Object.entries(e.errors).map(([, values]) => values.join(', '))
        : e.status,
    }
  }

  async getChildren({ application, auth }: TemplateApiModuleActionProps) {
    return this.childrenService.provideChildren(application, auth.nationalId)
  }

  async getPerson({ auth }: TemplateApiModuleActionProps) {
    const spouse = await this.nationalRegistryApi.getCohabitationInfo(
      auth.nationalId,
    )
    const person = await this.nationalRegistryApi.getIndividual(auth.nationalId)

    return (
      person && {
        spouse: spouse && {
          nationalId: spouse.spouseNationalId,
          name: spouse.spouseName,
        },
        fullname: person.fullName,
        genderCode: person.genderCode,
      }
    )
  }

  // If no children information from Heilsuvera
  // and the application is adoption | foster care | without primary parent
  // we make a children data
  async setChildrenInformation({ application }: TemplateApiModuleActionProps) {
    const {
      noPrimaryParentBirthDate,
      noChildrenFoundTypeOfApplication,
      fosterCareOrAdoptionDate,
      fosterCareOrAdoptionBirthDate,
    } = getApplicationAnswers(application.answers)

    const { applicantGenderCode, children } = getApplicationExternalData(
      application.externalData,
    )

    if (noChildrenFoundTypeOfApplication === OTHER_NO_CHILDREN_FOUND) {
      const child: ChildInformation = {
        hasRights: true,
        remainingDays: 180,
        expectedDateOfBirth: noPrimaryParentBirthDate,
        parentalRelation: ParentalRelations.secondary,
        primaryParentNationalRegistryId: '',
        primaryParentGenderCode: applicantGenderCode,
        primaryParentTypeOfApplication: noChildrenFoundTypeOfApplication,
      }

      const children: ChildInformation[] = [child]

      return { children }
    } else if (
      noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE ||
      noChildrenFoundTypeOfApplication === ADOPTION
    ) {
      const child: ChildInformation = {
        hasRights: true,
        remainingDays: 180,
        expectedDateOfBirth: '',
        adoptionDate: fosterCareOrAdoptionDate,
        dateOfBirth: fosterCareOrAdoptionBirthDate,
        parentalRelation: ParentalRelations.primary,
      }

      const children: ChildInformation[] = [child]

      return { children }
    } else {
      // "normal application" - children found just return them
      return { children }
    }
  }

  async setBirthDate({ application }: TemplateApiModuleActionProps) {
    const { dateOfBirth } = getApplicationExternalData(application.externalData)
    if (dateOfBirth?.data?.dateOfBirth) {
      return { dateOfBirth: dateOfBirth?.data?.dateOfBirth }
    }
    /*
    If you want to MOCK getting dateOfBirth from API use this.
    const fakeDateOfBirth = '2024-02-10'
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(fakeDateOfBirth)
      }, 5000)
    })
    const newValue = await promise
    return {
      dateOfBirth: newValue,
    }
    */
    try {
      const applicationInformation =
        await this.applicationInformationAPI.applicationGetApplicationInformation(
          {
            applicationId: application.id,
          },
        )
      return {
        dateOfBirth: applicationInformation.dateOfBirth,
      }
    } catch (e) {
      this.logger.error('Failed to fetch application information', e)
    }

    return {
      dateOfBirth: '',
    }
  }

  async assignOtherParent({ application }: TemplateApiModuleActionProps) {
    const { otherParentPhoneNumber } = getApplicationAnswers(
      application.answers,
    )

    await this.sharedTemplateAPIService.sendEmail(
      generateAssignOtherParentApplicationEmail,
      application,
    )

    try {
      if (
        otherParentPhoneNumber &&
        checkIfPhoneNumberIsGSM(otherParentPhoneNumber)
      ) {
        const clientLocationOrigin = getConfigValue(
          this.configService,
          'clientLocationOrigin',
        ) as string
        const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`

        await this.sharedTemplateAPIService.sendSms(
          () => generateAssignOtherParentApplicationSms(application, link),
          application,
        )
      }
    } catch (e) {
      this.logger.error(
        'Failed to send assigned SMS to otherParent in parental leave application',
        e,
      )
    }
  }

  async notifyApplicantOfRejectionFromOtherParent({
    application,
  }: TemplateApiModuleActionProps) {
    const { applicantPhoneNumber } = getApplicationAnswers(application.answers)

    await this.sharedTemplateAPIService.sendEmail(
      generateOtherParentRejected,
      application,
    )

    try {
      if (
        applicantPhoneNumber &&
        checkIfPhoneNumberIsGSM(applicantPhoneNumber)
      ) {
        const clientLocationOrigin = getConfigValue(
          this.configService,
          'clientLocationOrigin',
        ) as string

        const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`

        await this.sharedTemplateAPIService.sendSms(
          () => generateOtherParentRejectedApplicationSms(application, link),
          application,
        )
      }
    } catch (e) {
      this.logger.error(
        'Failed to send SMS notification about otherParent rejection in parental leave application',
        e,
      )
    }
  }

  async notifyApplicantOfRejectionFromEmployer({
    application,
  }: TemplateApiModuleActionProps) {
    const { applicantPhoneNumber } = getApplicationAnswers(application.answers)

    await this.sharedTemplateAPIService.sendEmail(
      generateEmployerRejected,
      application,
    )

    try {
      if (
        applicantPhoneNumber &&
        checkIfPhoneNumberIsGSM(applicantPhoneNumber)
      ) {
        const clientLocationOrigin = getConfigValue(
          this.configService,
          'clientLocationOrigin',
        ) as string

        const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`

        await this.sharedTemplateAPIService.sendSms(
          () => generateEmployerRejectedApplicationSms(application, link),
          application,
        )
      }
    } catch (e) {
      this.logger.error(
        'Failed to send SMS notification about Employer rejection in parental leave application',
        e,
      )
    }
  }

  async assignEmployer({ application }: TemplateApiModuleActionProps) {
    const employers = getUnApprovedEmployers(application.answers)

    const token = await this.sharedTemplateAPIService.createAssignToken(
      application,
      SIX_MONTHS_IN_SECONDS_EXPIRES,
    )

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignEmployerApplicationEmail,
      application,
      token,
    )

    // send confirmation sms to employer
    try {
      const phoneNumber = employers.length > 0 ? employers[0].phoneNumber : ''
      if (phoneNumber && checkIfPhoneNumberIsGSM(phoneNumber)) {
        await this.sharedTemplateAPIService.assignApplicationThroughSms(
          generateAssignEmployerApplicationSms,
          application,
          token,
        )
      }
    } catch (e) {
      this.logger.error(
        'Failed to send assign SMS notification to Employer in parental leave application',
        e,
      )
    }
  }

  async getPdf(application: Application, index = 0, fileUpload: string) {
    try {
      const filename = getValueViaPath(
        application.answers,
        fileUpload + `[${index}].key`,
      )

      const Key = `${application.id}/${filename}`
      const fileContent = await this.s3Service.getFileContent(
        {
          bucket: this.config.templateApi.attachmentBucket,
          key: Key,
        },
        'base64',
      )

      if (!fileContent) {
        throw new Error('File content was undefined')
      }

      return fileContent
    } catch (e) {
      this.logger.error('Cannot get ' + fileUpload + ' attachment', { e })
      throw new Error('Failed to get the ' + fileUpload + ' attachment')
    }
  }

  async getPDFs(
    application: Application,
    documents: Files[],
    attachmentType: string,
    fileUpload: string,
  ) {
    const PDFs = []
    for (const index of documents.keys()) {
      const pdf = await this.getPdf(application, index, fileUpload)
      PDFs.push({
        attachmentType,
        attachmentBytes: pdf,
      })
    }
    return PDFs
  }

  async getAttachments(application: Application): Promise<Attachment[]> {
    const attachments: Attachment[] = []
    const {
      isSelfEmployed,
      applicationType,
      otherParent,
      selfEmployedFiles: selfEmployedPdfs,
      studentFiles: studentPdfs,
      singleParentFiles: singleParentPdfs,
      employmentTerminationCertificateFiles:
        employmentTerminationCertificatePdfs,
      additionalDocuments,
      noChildrenFoundTypeOfApplication,
      employerLastSixMonths,
      employers,
      changeEmployerFile,
    } = getApplicationAnswers(application.answers)
    const { applicationFundId } = getApplicationExternalData(
      application.externalData,
    )
    const { residenceGrantFiles } = getApplicationAnswers(application.answers)
    const { state } = application
    const isNotStillEmployed = employers?.some(
      (employer) => employer.stillEmployed === NO,
    )

    if (
      state === States.VINNUMALASTOFNUN_APPROVE_EDITS ||
      state === States.RESIDENCE_GRANT_APPLICATION
    ) {
      if (residenceGrantFiles) {
        const PDFs = await this.getPDFs(
          application,
          residenceGrantFiles,
          apiConstants.attachments.residenceGrant,
          'fileUpload.residenceGrant',
        )
        attachments.push(...PDFs)
      }
    }

    if (changeEmployerFile) {
      const PDFs = await this.getPDFs(
        application,
        changeEmployerFile,
        apiConstants.attachments.changeEmployer,
        'fileUpload.changeEmployerFile',
      )
      attachments.push(...PDFs)
    }

    // We don't want to send old files to VMST again
    if (applicationFundId && applicationFundId !== '') {
      if (additionalDocuments) {
        const PDFs = await this.getPDFs(
          application,
          additionalDocuments,
          apiConstants.attachments.other,
          'fileUpload.additionalDocuments',
        )
        attachments.push(...PDFs)
      }
      return attachments
    }

    if (isSelfEmployed === YES && applicationType === PARENTAL_LEAVE) {
      if (selfEmployedPdfs?.length) {
        for (let i = 0; i <= selfEmployedPdfs.length - 1; i++) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.selfEmployedFile',
          )

          attachments.push({
            attachmentType: apiConstants.attachments.selfEmployed,
            attachmentBytes: pdf,
          })
        }
      } else {
        const oldSelfEmployedPdfs = (await getValueViaPath(
          application.answers,
          'employer.selfEmployed.file',
        )) as unknown[]

        if (oldSelfEmployedPdfs?.length) {
          for (let i = 0; i <= oldSelfEmployedPdfs.length - 1; i++) {
            const pdf = await this.getPdf(
              application,
              i,
              'employer.selfEmployed.file',
            )

            attachments.push({
              attachmentType: apiConstants.attachments.selfEmployed,
              attachmentBytes: pdf,
            })
          }
        }
      }
    } else if (applicationType === PARENTAL_GRANT_STUDENTS) {
      if (studentPdfs?.length) {
        for (let i = 0; i <= studentPdfs.length - 1; i++) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.studentFile',
          )

          attachments.push({
            attachmentType: apiConstants.attachments.student,
            attachmentBytes: pdf,
          })
        }
      }
    }
    if (
      (applicationType === PARENTAL_GRANT ||
        applicationType === PARENTAL_GRANT_STUDENTS) &&
      employerLastSixMonths === YES &&
      isNotStillEmployed
    ) {
      if (employmentTerminationCertificatePdfs?.length) {
        for (
          let i = 0;
          i <= employmentTerminationCertificatePdfs.length - 1;
          i++
        ) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.employmentTerminationCertificateFile',
          )

          attachments.push({
            attachmentType:
              apiConstants.attachments.employmentTerminationCertificate,
            attachmentBytes: pdf,
          })
        }
      }
    }

    if (otherParent === SINGLE) {
      if (singleParentPdfs?.length) {
        for (let i = 0; i <= singleParentPdfs.length - 1; i++) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.singleParent',
          )

          attachments.push({
            attachmentType: apiConstants.attachments.artificialInsemination,
            attachmentBytes: pdf,
          })
        }
      }
    }

    const {
      isReceivingUnemploymentBenefits,
      unemploymentBenefits,
      benefitsFiles: benefitsPdfs,
      commonFiles: genericPdfs,
    } = getApplicationAnswers(application.answers)
    if (
      isReceivingUnemploymentBenefits === YES &&
      (unemploymentBenefits === UnEmployedBenefitTypes.union ||
        unemploymentBenefits == UnEmployedBenefitTypes.healthInsurance)
    ) {
      if (benefitsPdfs?.length) {
        for (let i = 0; i <= benefitsPdfs.length - 1; i++) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.benefitsFile',
          )

          attachments.push({
            attachmentType: apiConstants.attachments.unEmploymentBenefits,
            attachmentBytes: pdf,
          })
        }
      }
    }

    if (isParentWithoutBirthParent(application.answers)) {
      const parentWithoutBirthParentPdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.parentWithoutBirthParent',
      )) as unknown[]

      if (parentWithoutBirthParentPdfs?.length) {
        for (let i = 0; i <= parentWithoutBirthParentPdfs.length - 1; i++) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.parentWithoutBirthParent',
          )

          attachments.push({
            attachmentType: apiConstants.attachments.parentWithoutBirthParent,
            attachmentBytes: pdf,
          })
        }
      }
    }

    if (noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE) {
      const permanentFosterCarePdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.permanentFosterCare',
      )) as unknown[]

      if (permanentFosterCarePdfs?.length) {
        for (let i = 0; i <= permanentFosterCarePdfs.length - 1; i++) {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.permanentFosterCare',
          )

          attachments.push({
            attachmentType: apiConstants.attachments.permanentFosterCare,
            attachmentBytes: pdf,
          })
        }
      }
    }

    if (noChildrenFoundTypeOfApplication === ADOPTION) {
      const adoptionPdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.adoption',
      )) as unknown[]

      if (adoptionPdfs?.length) {
        for (let i = 0; i <= adoptionPdfs.length - 1; i++) {
          const pdf = await this.getPdf(application, i, 'fileUpload.adoption')

          attachments.push({
            attachmentType: apiConstants.attachments.adoption,
            attachmentBytes: pdf,
          })
        }
      }
    }

    if (genericPdfs?.length) {
      for (let i = 0; i <= genericPdfs.length - 1; i++) {
        const pdf = await this.getPdf(application, i, 'fileUpload.file')

        attachments.push({
          attachmentType: apiConstants.attachments.other,
          attachmentBytes: pdf,
        })
      }
    }

    return attachments
  }

  async createRightsDTO(
    application: Application,
  ): Promise<ApplicationRights[]> {
    const { applicationType, otherParent, isRequestingRights, periods } =
      getApplicationAnswers(application.answers)

    const { VMSTApplicationRights } = getApplicationExternalData(
      application.externalData,
    )

    if (VMSTApplicationRights) {
      let usedDays = calculateDaysUsedByPeriods(periods)
      const rights = VMSTApplicationRights.map((VMSTRight) => {
        const availableDays = Number(VMSTRight.days)
        const daysLeft = Math.max(0, availableDays - usedDays)
        usedDays -= availableDays - daysLeft
        return {
          ...VMSTRight,
          daysLeft: String(daysLeft),
        }
      })
      return rights
    }

    const maximumPersonalDaysToSpend =
      getAvailablePersonalRightsInDays(application)
    const maximumMultipleBirthsDaysToSpend = getMultipleBirthsDays(application)
    const maximumAdditionalSingleParentDaysToSpend =
      getAdditionalSingleParentRightsInDays(application)
    const usedDays = calculateDaysUsedByPeriods(periods)

    const selectedChild = getSelectedChild(
      application.answers,
      application.externalData,
    )
    if (!selectedChild) {
      throw new Error('Missing selected child')
    }
    const transferredDays = getTransferredDays(application, selectedChild)
    const personalDays = getPersonalDays(application)

    const mulitpleBirthsRights =
      applicationType === PARENTAL_LEAVE
        ? apiConstants.rights.multipleBirthsOrlofRightsId
        : apiConstants.rights.multipleBirthsGrantRightsId

    const baseRight = getRightsCode(application)
    const rights = [
      {
        rightsUnit: baseRight,
        days: String(personalDays),
        rightsDescription: rightsDescriptions[baseRight],
        months: String(getPersonalDaysInMonths(application)),
        daysLeft: String(Math.max(0, personalDays - usedDays)),
      },
    ]

    const addMultipleBirthsRights = (
      rightsArray: ApplicationRights[],
      totalDays: number,
      usedDays: number,
    ) => {
      rightsArray.push({
        rightsUnit: mulitpleBirthsRights,
        days: String(maximumMultipleBirthsDaysToSpend),
        rightsDescription: rightsDescriptions[mulitpleBirthsRights],
        months: String(getMultipleBirthsDaysInMonths(application)),
        daysLeft: String(
          clamp(
            totalDays + maximumMultipleBirthsDaysToSpend - usedDays,
            0,
            maximumMultipleBirthsDaysToSpend,
          ),
        ),
      })
    }

    if (otherParent === SINGLE) {
      rights.push({
        rightsUnit: apiConstants.rights.artificialInseminationRightsId,
        days: String(maximumAdditionalSingleParentDaysToSpend),
        rightsDescription:
          rightsDescriptions[
            apiConstants.rights.artificialInseminationRightsId
          ],
        months: String(getAdditionalSingleParentRightsInMonths(application)),
        daysLeft: String(
          clamp(
            maximumPersonalDaysToSpend +
              maximumAdditionalSingleParentDaysToSpend -
              usedDays,
            0,
            maximumAdditionalSingleParentDaysToSpend,
          ),
        ),
      })
      if (maximumMultipleBirthsDaysToSpend > 0) {
        addMultipleBirthsRights(
          rights,
          personalDays + maximumAdditionalSingleParentDaysToSpend,
          usedDays,
        )
      }
    } else {
      if (maximumMultipleBirthsDaysToSpend > 0) {
        addMultipleBirthsRights(rights, personalDays, usedDays)
      }
      if (isRequestingRights === YES) {
        rights.push({
          rightsUnit: apiConstants.rights.receivingRightsId,
          days: String(transferredDays),
          rightsDescription:
            rightsDescriptions[apiConstants.rights.receivingRightsId],
          months: String(
            getTransferredDaysInMonths(application, selectedChild),
          ),

          daysLeft: String(
            clamp(
              maximumPersonalDaysToSpend +
                maximumMultipleBirthsDaysToSpend +
                transferredDays -
                usedDays,
              0,
              transferredDays,
            ),
          ),
        })
      }
    }

    return rights
  }

  calculatePeriodDays(
    startDate: string,
    endDate: string,
    ratio: string,
    daysToUse?: string,
    months?: number,
  ) {
    if (daysToUse) {
      return daysToUse
    }
    const start = parseISO(startDate)
    const end = parseISO(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid startDate or endDate')
    }
    const ratioNumber = Number(ratio)
    if (isNaN(ratioNumber) || ratioNumber <= 0) {
      throw new Error('Invalid ratio value')
    }
    const percentage = ratioNumber / 100
    const periodLength = calculatePeriodLength(start, end, undefined, months)
    return Math.round(periodLength * percentage)
  }

  createPeriodsDTO(
    periods: AnswerPeriod[],
    isActualDateOfBirth: boolean,
    rights: string,
  ): Period[] {
    return periods.map((period, index) => {
      const isFirstPeriod = index === 0
      const fixedRight = isFixedRight(period.rightCodePeriod)
      return {
        rightsCodePeriod: fixedRight ? period.rightCodePeriod : rights,
        from: getFromDate(
          isFirstPeriod,
          isActualDateOfBirth,
          period.useLength || '',
          period.endDateAdjustLength?.includes(YES) || false,
          period,
        ),
        to: period.endDate,
        ratio: `D${this.calculatePeriodDays(
          period.startDate,
          period.endDate,
          period.ratio,
          period.daysToUse,
          period.months,
        )}`,
        approved: !!period.approved,
        paid: !!period.paid,
      }
    })
  }

  async preparePeriodsAndRightsDTO(
    application: Application,
    periods: AnswerPeriod[],
    firstPeriodStart: string | undefined,
  ): Promise<{ rightsDTO: ApplicationRights[]; periodsDTO: Period[] }> {
    const rightsDTO = await this.createRightsDTO(application)
    const rightUnits = rightsDTO.map(({ rightsUnit }) => rightsUnit)
    const rights = rightUnits
      .filter((rightUnit) => !isFixedRight(rightUnit))
      .join(',')
    const isActualDateOfBirth =
      firstPeriodStart === StartDateOptions.ACTUAL_DATE_OF_BIRTH
    const periodsDTO = this.createPeriodsDTO(
      periods,
      isActualDateOfBirth,
      rights,
    )
    return { rightsDTO, periodsDTO }
  }

  async sendApplication({
    application,
    params = undefined,
  }: TemplateApiModuleActionProps) {
    const {
      isSelfEmployed,
      isReceivingUnemploymentBenefits,
      applicationType,
      employerLastSixMonths,
      employers,
      periods,
      firstPeriodStart,
    } = getApplicationAnswers(application.answers)
    // if (
    //   previousState === States.VINNUMALASTOFNUN_APPROVE_EDITS ||
    //   previousState === States.VINNUMALASTOFNUN_APPROVAL ||
    //   previousState === States.APPROVED
    // ) {
    //   return
    // }
    const nationalRegistryId = application.applicant
    const attachments = await this.getAttachments(application)
    const type = getType(application)

    const { periodsDTO, rightsDTO } = await this.preparePeriodsAndRightsDTO(
      application,
      periods,
      firstPeriodStart,
    )

    try {
      const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
        periodsDTO,
        attachments,
        false,
        getType(application),
        rightsDTO,
      )

      const response =
        await this.parentalLeaveApi.parentalLeaveSetParentalLeave({
          nationalRegistryId,
          parentalLeave: parentalLeaveDTO,
        })

      if (!response.id) {
        throw new Error(
          `Failed to send the parental leave application, no response.id from VMST API: ${response}`,
        )
      }

      // If applicant is sending additional documents then don't need to send email
      if (type === FileType.DOCUMENT) {
        return
      }

      // There has been case when island.is got Access Denied from AWS when sending out emails
      // This try/catch keeps application in correct state
      try {
        //if (
        //  application.state === States.RESIDENCE_GRANT_APPLICATION ||
        //  application.state ===
        //    States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE ||
        //  previousState === States.RESIDENCE_GRANT_APPLICATION
        //)
        //  return
        const selfEmployed =
          applicationType === PARENTAL_LEAVE ? isSelfEmployed === YES : true
        const recivingUnemploymentBenefits =
          isReceivingUnemploymentBenefits === YES
        const isStillEmployed = employers?.some(
          (employer) => employer.stillEmployed === YES,
        )

        if (
          (!selfEmployed && !recivingUnemploymentBenefits) ||
          ((applicationType === PARENTAL_GRANT ||
            applicationType === PARENTAL_GRANT_STUDENTS) &&
            employerLastSixMonths === YES &&
            isStillEmployed)
        ) {
          // Only needs to send an email if being approved by employer
          // Self employed applicant was aware of the approval
          await this.sharedTemplateAPIService.sendEmail(
            generateApplicationApprovedByEmployerEmail,
            application,
          )

          // Also send confirmation to employer
          await this.sharedTemplateAPIService.sendEmail(
            generateApplicationApprovedByEmployerToEmployerEmail,
            application,
          )
        }
      } catch (e) {
        this.logger.error(
          'Failed to send confirmation emails to applicant and employer in parental leave application',
          e,
        )
      }

      return response
    } catch (e) {
      this.logger.error('Failed to send the parental leave application', e)
      throw this.parseErrors(e)
    }
  }

  async validateApplication({ application }: TemplateApiModuleActionProps) {
    const nationalRegistryId = application.applicant
    const { previousState, periods, firstPeriodStart } = getApplicationAnswers(
      application.answers,
    )
    /* This is to avoid calling the api every time the user leaves the residenceGrantApplicationNoBirthDate state or residenceGrantApplication state */
    // Reject from
    if (previousState === States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE) {
      return
    }
    const attachments = await this.getAttachments(application)

    const { periodsDTO, rightsDTO } = await this.preparePeriodsAndRightsDTO(
      application,
      periods,
      firstPeriodStart,
    )

    try {
      const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
        periodsDTO,
        attachments,
        true,
        getType(application),
        rightsDTO,
      )

      // call SetParentalLeave API with testData: TRUE as this is a dummy request
      // for validation purposes
      await this.parentalLeaveApi.parentalLeaveSetParentalLeave({
        nationalRegistryId,
        parentalLeave: parentalLeaveDTO,
      })

      return
    } catch (e) {
      this.logger.warn('Failed to validate the parental leave application', e)
      throw this.parseErrors(e as VMSTError)
    }
  }

  async setVMSTPeriods({ application }: TemplateApiModuleActionProps) {
    try {
      const applicationInformation =
        await this.applicationInformationAPI.applicationGetApplicationInformation(
          {
            applicationId: application.id,
          },
        )

      return applicationInformation.periods
    } catch (e) {
      this.logger.warn(
        `Could not fetch applicationInformation on applicationId: ${application.id} with error: ${e}`,
      )
    }

    return null
  }

  async setApplicationRights({ application }: TemplateApiModuleActionProps) {
    try {
      const { applicationRights } =
        await this.applicationInformationAPI.applicationGetApplicationInformation(
          {
            applicationId: application.id,
          },
        )

      return applicationRights
    } catch (e) {
      this.logger.warn(
        `Could not fetch applicationRights on nationalId with error: ${e}`,
      )
    }

    return null
  }

  async setOtherParent({ application }: TemplateApiModuleActionProps) {
    try {
      const { otherParentId, otherParentName } =
        await this.applicationInformationAPI.applicationGetApplicationInformation(
          {
            applicationId: application.id,
          },
        )

      return { otherParentId, otherParentName }
    } catch (e) {
      this.logger.warn(
        `Could not fetch otherParent on applicationId: ${application.id} with error: ${e}`,
      )
    }

    return null
  }
}

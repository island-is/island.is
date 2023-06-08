import { Inject, Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import cloneDeep from 'lodash/cloneDeep'

import type { Attachment, Period } from '@island.is/clients/vmst'
import {
  ParentalLeaveApi,
  ApplicationInformationApi,
} from '@island.is/clients/vmst'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationConfigurations,
  Application,
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import {
  getApplicationAnswers,
  getAvailableRightsInDays,
  getAvailablePersonalRightsInDays,
  YES,
  NO,
  StartDateOptions,
  UnEmployedBenefitTypes,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  getMultipleBirthsDays,
  SINGLE,
  getAdditionalSingleParentRightsInDays,
  getApplicationExternalData,
  DAYS_IN_MONTH,
  getUnApprovedEmployers,
  ParentalRelations,
  ChildInformation,
  isParentWithoutBirthParent,
  calculatePeriodLength,
  PERMANENT_FOSTER_CARE,
  OTHER_NO_CHILDREN_FOUND,
  States,
  ADOPTION,
  FileType,
} from '@island.is/application/templates/parental-leave'

import { SharedTemplateApiService } from '../../shared'
import {
  BaseTemplateAPIModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../types'
import {
  generateAssignOtherParentApplicationEmail,
  generateAssignEmployerApplicationEmail,
  generateOtherParentRejected,
  generateEmployerRejected,
  generateApplicationApprovedByEmployerEmail,
  generateApplicationApprovedByEmployerToEmployerEmail,
} from './emailGenerators'
import {
  generateAssignEmployerApplicationSms,
  generateAssignOtherParentApplicationSms,
  generateEmployerRejectedApplicationSms,
  generateOtherParentRejectedApplicationSms,
} from './smsGenerators'
import {
  transformApplicationToParentalLeaveDTO,
  getRatio,
  getRightsCode,
  checkIfPhoneNumberIsGSM,
} from './parental-leave.utils'
import { apiConstants } from './constants'
import { ConfigService } from '@nestjs/config'
import { getConfigValue } from '../../shared/shared.utils'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ChildrenService } from './children/children.service'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'

interface VMSTError {
  type: string
  title: string
  status: number
  traceId: string
  errors: Record<string, string[]>
}

type YesOrNo = typeof NO | typeof YES
interface AnswerPeriod {
  startDate: string
  endDate: string
  ratio: string
  firstPeriodStart?: string
  useLength?: YesOrNo
  daysToUse?: string
  rawIndex?: number
  rightCodePeriod?: string
}

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'
const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60
const df = 'yyyy-MM-dd'

@Injectable()
export class ParentalLeaveService extends BaseTemplateApiService {
  s3 = new S3()

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private parentalLeaveApi: ParentalLeaveApi,
    private applicationInformationAPI: ApplicationInformationApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(APPLICATION_ATTACHMENT_BUCKET)
    private readonly attachmentBucket: string,
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
    private readonly childrenService: ChildrenService,
    private readonly nationalRegistryApi: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.PARENTAL_LEAVE)
  }

  private parseErrors(e: Error | VMSTError) {
    if (e instanceof Error) {
      return e.message
    }

    return {
      message: Object.entries(e.errors).map(([, values]) => values.join(', ')),
    }
  }

  // Check whether phoneNumber is GSM
  checkIfPhoneNumberIsGSM(phoneNumber: string) {
    const phoneNumberStartStr = ['6', '7', '8']
    return phoneNumberStartStr.some((substr) => phoneNumber.startsWith(substr))
  }

  getFromDate(
    isFirstPeriod: boolean,
    isActualDateOfBirth: boolean,
    useLength: string,
    period: AnswerPeriod,
  ) {
    return isFirstPeriod && isActualDateOfBirth && useLength === YES
      ? apiConstants.actualDateOfBirthMonths
      : isFirstPeriod && isActualDateOfBirth
      ? apiConstants.actualDateOfBirth
      : period.startDate
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

    const { applicantGenderCode, children, existingApplications } =
      getApplicationExternalData(application.externalData)

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

      return {
        children: children,
        existingApplications,
      }
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

      return {
        children: children,
        existingApplications,
      }
    } else {
      // "normal application" - children found just return them
      return {
        children: children,
        existingApplications,
      }
    }
  }

  async setBirthDate({ application }: TemplateApiModuleActionProps) {
    const { dateOfBirth } = getApplicationExternalData(application.externalData)
    if (dateOfBirth?.data?.dateOfBirth) {
      return dateOfBirth?.data?.dateOfBirth
    }
    /*
    If you want to MOCK getting dateOfBirth from API use this.
    const fakeDateOfBirth = '2023-02-10'
    const promise = new Promise(function (resolve) {
      setTimeout(() => {
        resolve(fakeDateOfBirth)}, 5000)})
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
      this.logger.warning('Failed to fetch application information', e)
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
      const file = await this.s3
        .getObject({ Bucket: this.attachmentBucket, Key })
        .promise()
      const fileContent = file.Body as Buffer

      if (!fileContent) {
        throw new Error('File content was undefined')
      }

      return fileContent.toString('base64')
    } catch (e) {
      this.logger.error('Cannot get ' + fileUpload + ' attachment', { e })
      throw new Error('Failed to get the ' + fileUpload + ' attachment')
    }
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
      state === States.RESIDENCE_GRAND_APPLICATION
    ) {
      if (residenceGrantFiles) {
        residenceGrantFiles.forEach(async (item, index) => {
          const pdf = await this.getPdf(
            application,
            index,
            'fileUpload.residenceGrant',
          )
          attachments.push({
            attachmentType: apiConstants.attachments.residenceGrant,
            attachmentBytes: pdf,
          })
        })
      }
    }
    // We don't want to send old files to VMST again
    if (applicationFundId && applicationFundId !== '') {
      if (additionalDocuments) {
        additionalDocuments.forEach(async (val, i) => {
          const pdf = await this.getPdf(
            application,
            i,
            'fileUpload.additionalDocuments',
          )
          attachments.push({
            attachmentType: apiConstants.attachments.other,
            attachmentBytes: pdf,
          })
        })
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

  async getCalculatedPeriod(
    nationalRegistryId: string,
    startDate: Date,
    startDateString: string | undefined,
    periodLength: number,
    period: AnswerPeriod,
    rightsCodePeriod: string,
  ): Promise<Period> {
    const periodObj = {
      from: startDateString ?? format(startDate, df),
      approved: false,
      paid: false,
      rightsCodePeriod: rightsCodePeriod,
    }
    if (period.ratio === '100') {
      const isUsingNumberOfDays = period.daysToUse !== undefined
      const getPeriodEndDate =
        await this.parentalLeaveApi.parentalLeaveGetPeriodEndDate({
          nationalRegistryId,
          startDate: startDate,
          length: String(periodLength),
          percentage: period.ratio,
        })

      if (getPeriodEndDate.periodEndDate === undefined) {
        throw new Error(
          `Could not calculate end date of period starting ${period.startDate} and using ${periodLength} days of rights`,
        )
      }

      return {
        ...periodObj,
        to: format(getPeriodEndDate.periodEndDate, df),
        ratio: getRatio(
          period.ratio,
          periodLength.toString(),
          isUsingNumberOfDays,
        ),
      }
    } else {
      const isUsingNumberOfDays = true

      // Calculate endDate from periodLength, startDate and percentage ( period.ratio )
      const actualDaysFromPercentage = Math.floor(
        periodLength / (Number(period.ratio) / 100),
      )
      const additionalMonths = Math.floor(
        actualDaysFromPercentage / DAYS_IN_MONTH,
      )
      const additionalDays = actualDaysFromPercentage % DAYS_IN_MONTH

      const startDateAddMonths = addMonths(startDate, additionalMonths)
      const endDate = addDays(startDateAddMonths, additionalDays)

      return {
        ...periodObj,
        to: format(endDate, df),
        ratio: getRatio(
          period.ratio,
          periodLength.toString(),
          isUsingNumberOfDays,
        ),
      }
    }
  }

  async createPeriodsDTO(
    application: Application,
    nationalRegistryId: string,
  ): Promise<Period[]> {
    const {
      periods: originalPeriods,
      firstPeriodStart,
      applicationType,
      otherParent,
    } = getApplicationAnswers(application.answers)

    const { applicationFundId } = getApplicationExternalData(
      application.externalData,
    )

    const answers = cloneDeep(originalPeriods).sort((a, b) => {
      const dateA = new Date(a.startDate)
      const dateB = new Date(b.startDate)

      return dateA.getTime() - dateB.getTime()
    })

    let vmstRightCodePeriod = null
    if (applicationFundId) {
      try {
        const VMSTperiods =
          await this.applicationInformationAPI.applicationGetApplicationInformation(
            {
              applicationId: application.id,
            },
          )

        if (VMSTperiods?.periods) {
          /*
           * Sometime applicant uses other right than basic right ( grunnréttindi)
           * Here we make sure we only use/sync amd use basic right ( grunnréttindi ) from VMST
           */
          const getVMSTRightCodePeriod =
            VMSTperiods.periods[0].rightsCodePeriod.split(',')[0]
          const periodCodeStartCharacters = ['M', 'F']
          if (
            periodCodeStartCharacters.some((c) =>
              getVMSTRightCodePeriod.startsWith(c),
            )
          ) {
            vmstRightCodePeriod = getVMSTRightCodePeriod
          }
        }
      } catch (e) {
        this.logger.warn(
          `Could not fetch applicationInformation on applicationId: {applicationId} with error: {error}`
            .replace(`{${'applicationId'}}`, application.id)
            .replace(`{${'error'}}`, e),
        )
      }
    }

    const periods: Period[] = []
    const maximumDaysToSpend = getAvailableRightsInDays(application)
    const maximumPersonalDaysToSpend =
      getAvailablePersonalRightsInDays(application)
    const maximumMultipleBirthsDaysToSpend = getMultipleBirthsDays(application)
    const maximumAdditionalSingleParentDaysToSpend =
      getAdditionalSingleParentRightsInDays(application)
    const maximumDaysBeforeUsingTransferRights =
      maximumPersonalDaysToSpend + maximumMultipleBirthsDaysToSpend
    const maximumSingleParentDaysBeforeUsingMultipleBirthsRights =
      maximumPersonalDaysToSpend + maximumAdditionalSingleParentDaysToSpend

    const mulitpleBirthsRights =
      applicationType === PARENTAL_LEAVE
        ? apiConstants.rights.multipleBirthsOrlofRightsId
        : apiConstants.rights.multipleBirthsGrantRightsId

    const isActualDateOfBirth =
      firstPeriodStart === StartDateOptions.ACTUAL_DATE_OF_BIRTH
    let numberOfDaysAlreadySpent = 0
    const basicRightCodePeriod =
      vmstRightCodePeriod ?? getRightsCode(application)

    for (const [index, period] of answers.entries()) {
      const isFirstPeriod = index === 0
      const isUsingNumberOfDays =
        period.daysToUse !== undefined && period.daysToUse !== ''

      // If a period doesn't have both startDate or endDate we skip it
      if (!isFirstPeriod && (!period.startDate || !period.endDate)) {
        continue
      }

      const startDate = new Date(period.startDate)
      const endDate = new Date(period.endDate)
      const useLength = period.useLength || ''

      let periodLength = 0

      if (isUsingNumberOfDays) {
        periodLength = Number(period.daysToUse)
      } else if (Number(period.ratio) < 100) {
        /*
         * We need to calculate periodLength when ratio is not 100%
         * because there could be mis-calculate betweeen island.is and VMST
         * for example:
         * 8 months period with 75%
         * island.is calculator returns: 180 days
         * VMST returns: 184 days
         */
        const fullLength = calculatePeriodLength(startDate, endDate)
        periodLength = Math.round(fullLength * (Number(period.ratio) / 100))
      } else {
        const getPeriodLength =
          await this.parentalLeaveApi.parentalLeaveGetPeriodLength({
            nationalRegistryId,
            startDate,
            endDate,
            percentage: period.ratio,
          })

        if (getPeriodLength.periodLength === undefined) {
          throw new Error(
            `Could not calculate length of period from ${period.startDate} to ${period.endDate}`,
          )
        }

        periodLength = Number(getPeriodLength.periodLength ?? 0)
      }

      const numberOfDaysSpentAfterPeriod =
        numberOfDaysAlreadySpent + periodLength

      if (numberOfDaysSpentAfterPeriod > maximumDaysToSpend) {
        throw new Error(
          `Period from ${period.startDate} to ${period.endDate} will exceed rights (${numberOfDaysSpentAfterPeriod} > ${maximumDaysToSpend})`,
        )
      }

      const isUsingAdditionalRights =
        numberOfDaysAlreadySpent >=
        maximumDaysToSpend - maximumAdditionalSingleParentDaysToSpend
      const willSingleParentStartToUseAdditionalRightsWithPeriod =
        numberOfDaysSpentAfterPeriod >
        maximumDaysToSpend - maximumAdditionalSingleParentDaysToSpend
      const isSingleParentUsingMultipleBirthsRights =
        numberOfDaysAlreadySpent >=
        maximumSingleParentDaysBeforeUsingMultipleBirthsRights
      const isSingleParentUsingPersonalRights =
        numberOfDaysAlreadySpent < maximumPersonalDaysToSpend
      const willSingleParentStartUsingMultipleBirthsRight =
        numberOfDaysSpentAfterPeriod >
        maximumPersonalDaysToSpend + maximumAdditionalSingleParentDaysToSpend

      const isUsingMultipleBirthsRights =
        numberOfDaysAlreadySpent >= maximumPersonalDaysToSpend
      const willStartToUseMultipleBirthsRightsWithPeriod =
        numberOfDaysSpentAfterPeriod > maximumPersonalDaysToSpend
      const isUsingTransferredRights =
        numberOfDaysAlreadySpent >= maximumDaysBeforeUsingTransferRights
      const willStartToUseTransferredRightsWithPeriod =
        numberOfDaysSpentAfterPeriod > maximumDaysBeforeUsingTransferRights

      /*
        ** Priority rights:
        ** 1. personal rights
        ** 2. single parent rights
        ** 3. common rights ( from multiple births)
        ** 4. transfer rights ( from other parent)
        We have to finish first one before go to next and so on
        */
      if (
        !isUsingTransferredRights &&
        !willStartToUseTransferredRightsWithPeriod &&
        !isUsingMultipleBirthsRights &&
        !willStartToUseMultipleBirthsRightsWithPeriod &&
        !isUsingAdditionalRights &&
        !willSingleParentStartToUseAdditionalRightsWithPeriod
      ) {
        // We know its a normal period and it will not exceed personal rights
        periods.push({
          from: this.getFromDate(
            isFirstPeriod,
            isActualDateOfBirth,
            useLength,
            period,
          ),
          to: period.endDate,
          ratio: getRatio(
            period.ratio,
            periodLength.toString(),
            period.ratio === '100' ? isUsingNumberOfDays : true,
          ),
          approved: false,
          paid: false,
          rightsCodePeriod: basicRightCodePeriod,
        })
      } else if (otherParent === SINGLE) {
        // single parent
        // Only using multiple births right
        if (isSingleParentUsingMultipleBirthsRights) {
          periods.push({
            from: period.startDate,
            to: period.endDate,
            ratio: getRatio(
              period.ratio,
              periodLength.toString(),
              period.ratio === '100' ? isUsingNumberOfDays : true,
            ),
            approved: false,
            paid: false,
            rightsCodePeriod: mulitpleBirthsRights,
          })
        } else {
          /*
           ** If we reach here, we have a period that will have:
           ** 1: Personal rights and additional rights
           ** 2: Personal, additional and multiplebirths rights
           ** 3: Additional rights and multipleBirths rights
           ** 4: Addtitonal rights
           */
          if (maximumMultipleBirthsDaysToSpend === 0) {
            if (isSingleParentUsingPersonalRights) {
              // 1. Personal rights and additional rights
              // Personal rights
              const daysLeftOfPersonalRights =
                maximumPersonalDaysToSpend - numberOfDaysAlreadySpent
              const fromDate = this.getFromDate(
                isFirstPeriod,
                isActualDateOfBirth,
                useLength,
                period,
              )

              const personalPeriod = await this.getCalculatedPeriod(
                nationalRegistryId,
                startDate,
                fromDate,
                daysLeftOfPersonalRights,
                period,
                basicRightCodePeriod,
              )

              periods.push(personalPeriod)

              // Additional rights
              const additionalSingleParentPeriodStartDate = addDays(
                new Date(personalPeriod.to),
                1,
              )
              const lengthOfPeriodUsingAdditionalSingleParentDays =
                periodLength - daysLeftOfPersonalRights

              periods.push({
                from: format(additionalSingleParentPeriodStartDate, df),
                to: period.endDate,
                ratio: getRatio(
                  period.ratio,
                  lengthOfPeriodUsingAdditionalSingleParentDays.toString(),
                  true,
                ),
                approved: false,
                paid: false,
                rightsCodePeriod:
                  apiConstants.rights.artificialInseminationRightsId,
              })
            } else {
              // 4. Additional rights
              periods.push({
                from: period.startDate,
                to: period.endDate,
                ratio: getRatio(
                  period.ratio,
                  periodLength.toString(),
                  period.ratio === '100' ? isUsingNumberOfDays : true,
                ),
                approved: false,
                paid: false,
                rightsCodePeriod:
                  apiConstants.rights.artificialInseminationRightsId,
              })
            }
          } else {
            if (isSingleParentUsingPersonalRights) {
              // 2. Personal, additional and multipleBirths rights
              // Personal rights
              const daysLeftOfPersonalRights =
                maximumPersonalDaysToSpend - numberOfDaysAlreadySpent
              const fromDate = this.getFromDate(
                isFirstPeriod,
                isActualDateOfBirth,
                useLength,
                period,
              )

              const personalPeriod = await this.getCalculatedPeriod(
                nationalRegistryId,
                startDate,
                fromDate,
                daysLeftOfPersonalRights,
                period,
                basicRightCodePeriod,
              )

              periods.push(personalPeriod)

              const additionalSingleParentPeriodStartDate = addDays(
                new Date(personalPeriod.to),
                1,
              )

              // Additional rights
              if (willSingleParentStartUsingMultipleBirthsRight) {
                const additionalPeriod = await this.getCalculatedPeriod(
                  nationalRegistryId,
                  additionalSingleParentPeriodStartDate,
                  undefined,
                  maximumAdditionalSingleParentDaysToSpend,
                  period,
                  apiConstants.rights.artificialInseminationRightsId,
                )

                periods.push(additionalPeriod)

                // Common rights (multiple births)
                const commonPeriodStartDate = addDays(
                  new Date(additionalPeriod.to),
                  1,
                )
                const lengthOfPeriodUsingCommonDays =
                  periodLength -
                  daysLeftOfPersonalRights -
                  maximumAdditionalSingleParentDaysToSpend

                periods.push({
                  from: format(commonPeriodStartDate, df),
                  to: period.endDate,
                  ratio: getRatio(
                    period.ratio,
                    lengthOfPeriodUsingCommonDays.toString(),
                    true,
                  ),
                  approved: false,
                  paid: false,
                  rightsCodePeriod: mulitpleBirthsRights,
                })
              } else {
                // Additional rights
                const lengthOfPeriodUsingAdditionalDays =
                  periodLength - daysLeftOfPersonalRights

                periods.push({
                  from: format(additionalSingleParentPeriodStartDate, df),
                  to: period.endDate,
                  ratio: getRatio(
                    period.ratio,
                    lengthOfPeriodUsingAdditionalDays.toString(),
                    true,
                  ),
                  approved: false,
                  paid: false,
                  rightsCodePeriod:
                    apiConstants.rights.artificialInseminationRightsId,
                })
              }
            } else {
              // 3. Additional rights and multipleBirths rights
              if (willSingleParentStartUsingMultipleBirthsRight) {
                // Additional rights
                const lengthOfPeriodUsingAdditionalSingleParentDays =
                  maximumPersonalDaysToSpend +
                  maximumAdditionalSingleParentDaysToSpend -
                  numberOfDaysAlreadySpent

                const additionalPeriod = await this.getCalculatedPeriod(
                  nationalRegistryId,
                  startDate,
                  undefined,
                  lengthOfPeriodUsingAdditionalSingleParentDays,
                  period,
                  apiConstants.rights.artificialInseminationRightsId,
                )

                periods.push(additionalPeriod)

                // Common rights (multiple births)
                const commonPeriodStartDate = addDays(
                  new Date(additionalPeriod.to),
                  1,
                )
                const lengthOfPeriodUsingCommonDays =
                  periodLength - lengthOfPeriodUsingAdditionalSingleParentDays

                periods.push({
                  from: format(commonPeriodStartDate, df),
                  to: period.endDate,
                  ratio: getRatio(
                    period.ratio,
                    lengthOfPeriodUsingCommonDays.toString(),
                    true,
                  ),
                  approved: false,
                  paid: false,
                  rightsCodePeriod: mulitpleBirthsRights,
                })
              } else {
                // Only additional rights
                periods.push({
                  from: period.startDate,
                  to: period.endDate,
                  ratio: getRatio(
                    period.ratio,
                    periodLength.toString(),
                    period.ratio === '100' ? isUsingNumberOfDays : true,
                  ),
                  approved: false,
                  paid: false,
                  rightsCodePeriod:
                    apiConstants.rights.artificialInseminationRightsId,
                })
              }
            }
          }
        }
      } else {
        // has other parent
        // We know all of the period will be using transferred rights
        if (isUsingTransferredRights) {
          periods.push({
            from: period.startDate,
            to: period.endDate,
            ratio: getRatio(
              period.ratio,
              periodLength.toString(),
              period.ratio === '100' ? isUsingNumberOfDays : true,
            ),
            approved: false,
            paid: false,
            rightsCodePeriod: apiConstants.rights.receivingRightsId,
          })
        } else if (willStartToUseTransferredRightsWithPeriod) {
          /*
           ** If we reach here, we have a period that will have to be split into
           ** two, a part of it will be using personal/personal rights and the other part
           ** will be using transferred rights
           ** Case:
           ** 1. Period includes personal rights and transfer rights
           ** 2. Period includes common rights and transfer rights
           ** 3. Period includes personal rights, common rights and transfer rights
           */

          // 1. Period includes personal and transfer rights
          if (maximumMultipleBirthsDaysToSpend === 0) {
            const fromDate = this.getFromDate(
              isFirstPeriod,
              isActualDateOfBirth,
              useLength,
              period,
            )

            // Personal
            const daysLeftOfPersonalRights =
              maximumPersonalDaysToSpend - numberOfDaysAlreadySpent
            const personalPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              startDate,
              fromDate,
              daysLeftOfPersonalRights,
              period,
              basicRightCodePeriod,
            )

            periods.push(personalPeriod)

            // Transferred
            const transferredPeriodStartDate = addDays(
              new Date(personalPeriod.to),
              1,
            )
            const lengthOfPeriodUsingTransferredDays =
              periodLength - daysLeftOfPersonalRights

            periods.push({
              from: format(transferredPeriodStartDate, df),
              to: period.endDate,
              ratio: getRatio(
                period.ratio,
                lengthOfPeriodUsingTransferredDays.toString(),
                true,
              ),
              approved: false,
              paid: false,
              rightsCodePeriod: apiConstants.rights.receivingRightsId,
            })
          }
          // 2. Period includes common and transfer rights
          else if (maximumPersonalDaysToSpend < numberOfDaysAlreadySpent) {
            // Common (multiple births)
            const daysLeftOfCommonRights =
              maximumDaysBeforeUsingTransferRights - numberOfDaysAlreadySpent
            const commonPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              startDate,
              undefined,
              daysLeftOfCommonRights,
              period,
              mulitpleBirthsRights,
            )

            periods.push(commonPeriod)

            // Transferred
            const transferredPeriodStartDate = addDays(
              new Date(commonPeriod.to),
              1,
            )
            const lengthOfPeriodUsingTransferredDays =
              periodLength - daysLeftOfCommonRights

            periods.push({
              from: format(transferredPeriodStartDate, df),
              to: period.endDate,
              ratio: getRatio(
                period.ratio,
                lengthOfPeriodUsingTransferredDays.toString(),
                true,
              ),
              approved: false,
              paid: false,
              rightsCodePeriod: apiConstants.rights.receivingRightsId,
            })
          }
          // 3. Period includes personal, common and transfer rights
          else {
            // Personal
            const daysLeftOfPersonalRights =
              maximumPersonalDaysToSpend - numberOfDaysAlreadySpent
            const fromDate = this.getFromDate(
              isFirstPeriod,
              isActualDateOfBirth,
              useLength,
              period,
            )
            const personalPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              startDate,
              fromDate,
              daysLeftOfPersonalRights,
              period,
              basicRightCodePeriod,
            )

            periods.push(personalPeriod)

            // Common
            const commonPeriodStartDate = addDays(
              new Date(personalPeriod.to),
              1,
            )
            const commonPeriod = await this.getCalculatedPeriod(
              nationalRegistryId,
              commonPeriodStartDate,
              undefined,
              maximumMultipleBirthsDaysToSpend,
              period,
              mulitpleBirthsRights,
            )

            periods.push(commonPeriod)

            // Transferred
            const transferredPeriodStartDate = addDays(
              new Date(commonPeriod.to),
              1,
            )
            const lengthOfPeriodUsingTransferredDays =
              periodLength -
              daysLeftOfPersonalRights -
              maximumMultipleBirthsDaysToSpend

            periods.push({
              from: format(transferredPeriodStartDate, df),
              to: period.endDate,
              ratio: getRatio(
                period.ratio,
                lengthOfPeriodUsingTransferredDays.toString(),
                true,
              ),
              approved: false,
              paid: false,
              rightsCodePeriod: apiConstants.rights.receivingRightsId,
            })
          }
        } else if (isUsingMultipleBirthsRights) {
          // Applicant used upp his/her basic rights and started to use 'common' rights
          // and has not reach transfer rights
          periods.push({
            from: period.startDate,
            to: period.endDate,
            ratio: getRatio(
              period.ratio,
              periodLength.toString(),
              period.ratio === '100' ? isUsingNumberOfDays : true,
            ),
            approved: false,
            paid: false,
            rightsCodePeriod: mulitpleBirthsRights,
          })
        } else {
          // If we reach here then there is personal rights mix with common rights
          // Personal
          const daysLeftOfPersonalRights =
            maximumPersonalDaysToSpend - numberOfDaysAlreadySpent
          const fromDate = this.getFromDate(
            isFirstPeriod,
            isActualDateOfBirth,
            useLength,
            period,
          )
          const personalPeriod = await this.getCalculatedPeriod(
            nationalRegistryId,
            startDate,
            fromDate,
            daysLeftOfPersonalRights,
            period,
            basicRightCodePeriod,
          )

          periods.push(personalPeriod)

          // Common (multiple births)
          const commonPeriodStartDate = addDays(new Date(personalPeriod.to), 1)
          const lengthOfPeriodUsingCommonDays =
            periodLength - daysLeftOfPersonalRights

          periods.push({
            from: format(commonPeriodStartDate, df),
            to: period.endDate,
            ratio: getRatio(
              period.ratio,
              lengthOfPeriodUsingCommonDays.toString(),
              true,
            ),
            approved: false,
            paid: false,
            rightsCodePeriod: mulitpleBirthsRights,
          })
        }
      }

      // Add each period to the total number of days spent when an iteration is finished
      numberOfDaysAlreadySpent += periodLength
    }

    return periods
  }

  checkActionName = (
    application: ApplicationWithAttachments,
    params: FileType | undefined = undefined,
  ) => {
    const { actionName } = getApplicationAnswers(application.answers)
    if (params) {
      params === 'document' ||
        params === 'documentPeriod' ||
        params === 'period'
      return params
    }
    if (
      actionName === 'document' ||
      actionName === 'documentPeriod' ||
      actionName === 'period'
    ) {
      return actionName
    }
    return undefined
  }

  isParamsActionName = (params: any) => {
    typeof params === 'string' &&
    (params === 'period' ||
      params === 'document' ||
      params === 'documentPeriod')
      ? (params as FileType)
      : undefined
    return params
  }

  async sendApplication({
    application,
    params = undefined,
  }: TemplateApiModuleActionProps) {
    const {
      isSelfEmployed,
      isReceivingUnemploymentBenefits,
      applicationType,
      previousState,
      employerLastSixMonths,
      employers,
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

    try {
      const actionNameFromParams =
        previousState === States.RESIDENCE_GRAND_APPLICATION
          ? this.isParamsActionName(params)
          : undefined

      const periods = await this.createPeriodsDTO(
        application,
        nationalRegistryId,
      )

      const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
        periods,
        attachments,
        false, // put false in testData as this is not dummy request
        this.checkActionName(application, actionNameFromParams),
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
      const { actionName } = getApplicationAnswers(application.answers)
      if (actionName === 'document') {
        return
      }

      // There has been case when island.is got Access Denied from AWS when sending out emails
      // This try/catch keeps application in correct state
      try {
        //if (
        //  application.state === States.RESIDENCE_GRAND_APPLICATION ||
        //  application.state ===
        //    States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE ||
        //  previousState === States.RESIDENCE_GRAND_APPLICATION
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

  async validateApplication({
    application,
    params = undefined,
  }: TemplateApiModuleActionProps) {
    const nationalRegistryId = application.applicant
    const { previousState } = getApplicationAnswers(application.answers)
    /* This is to avoid calling the api every time the user leaves the residenceGrantApplicationNoBirthDate state or residenceGrantApplication state */
    // Reject from
    if (previousState === States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE) {
      return
    }
    const attachments = await this.getAttachments(application)
    try {
      const actionNameFromParams = this.isParamsActionName(params)

      const periods = await this.createPeriodsDTO(
        application,
        nationalRegistryId,
      )

      const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
        periods,
        attachments,
        true,
        this.checkActionName(application, actionNameFromParams),
      )

      // call SetParentalLeave API with testData: TRUE as this is a dummy request
      // for validation purposes
      await this.parentalLeaveApi.parentalLeaveSetParentalLeave({
        nationalRegistryId,
        parentalLeave: parentalLeaveDTO,
      })

      return
    } catch (e) {
      this.logger.error('Failed to validate the parental leave application', e)
      throw this.parseErrors(e as VMSTError)
    }
  }
}

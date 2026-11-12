import { Inject, Injectable } from '@nestjs/common'
import { S3Service } from '@island.is/nest/aws'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import {
  ADOPTION,
  ChildInformation,
  FileType,
  OTHER_NO_CHILDREN_FOUND,
  BIRTH,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  PERMANENT_FOSTER_CARE,
  ParentalRelations,
  RejectedBy,
  SINGLE,
  States,
  UnEmployedBenefitTypes,
  calculateDaysUsedByPeriods,
  calculatePeriodLength,
  getAdditionalSingleParentRightsInDays,
  getApplicationAnswers,
  getShortPeriodWithoutPredecessorError,
  getVMSTRightsWithTransfer,
  getApplicationExternalData,
  getAvailablePersonalRightsInDays,
  getMultipleBirthsDays,
  getSelectedChild,
  getTransferredDays,
  getVmstApplicationId,
  getPreviousVmstLeave,
  getRejectedBy,
  getTransferredDaysInMonths,
  getUnApprovedEmployers,
  isParentWithoutBirthParent,
  isNoChildrenFoundPath,
  errorMessages,
  Period as AnswerPeriod,
  getPersonalDays,
  getPersonalDaysInMonths,
  StartDateOptions,
  getAdditionalSingleParentRightsInMonths,
  clamp,
  getMultipleBirthsDaysInMonths,
  Files,
} from '@island.is/application/templates/parental-leave-v2'
import {
  Application,
  ApplicationConfigurations,
  ApplicationTypes,
  NationalRegistrySpouseV3,
  NotificationType,
  StaticTextObject,
} from '@island.is/application/types'
import type {
  ApplicationRight,
  Attachment,
  NewApplication,
  ParentalLeave,
  Period,
} from '@island.is/clients/vmst'
import {
  ApplicationApi,
  describeVmstError,
  ParentalLeaveApi,
} from '@island.is/clients/vmst'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
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
  getStoredVmstParentalLeaves,
  VmstParentalLeavesData,
} from './vmst-parental-leaves'
import {
  MOCK_APPLICATION_FUND_ID,
  SIX_MONTHS_IN_SECONDS_EXPIRES,
  apiConstants,
  rightsDescriptions,
} from './constants'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import {
  generateApplicationApprovedByEmployerEmail,
  generateApplicationApprovedByEmployerToEmployerEmail,
  generateAssignEmployerApplicationEmail,
  generateAssignOtherParentApplicationEmail,
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
} from './smsGenerators'
import parseISO from 'date-fns/parseISO'
import { NationalRegistryV3Service } from '../../shared/api/national-registry-v3/national-registry-v3.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { NotificationsService } from '../../../notification/notifications.service'

// Only on VMST's per-applicant parental-leaves list, not on
// `GET /applications/{id}`.
type VmstFollowUpFields = Pick<
  ParentalLeave,
  'language' | 'otherParentBlocked' | 'noOfChildren' | 'adoptionDate'
>

// Inserted into the `HNIPP.AS.PL.REJECTED` template as its subject.
const rejectedByNames: Record<RejectedBy, string> = {
  [RejectedBy.OTHER_PARENT]: 'Hitt foreldrið',
  [RejectedBy.EMPLOYER]: 'Vinnuveitandi',
  [RejectedBy.VMST]: 'Vinnumálastofnun',
}

// True when the application continues a leave VMST lists for this applicant,
// so there is a VMST record to look up.
const hasPreviousApplication = (application: Application): boolean =>
  !!getPreviousVmstLeave(application)

@Injectable()
export class ParentalLeaveV2Service extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private parentalLeaveApi: ParentalLeaveApi,
    private applicationApi: ApplicationApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(sharedModuleConfig.KEY)
    private config: ConfigType<typeof sharedModuleConfig>,
    private readonly configService: ConfigService<SharedModuleConfig>,
    private readonly childrenService: ChildrenService,
    private readonly nationalRegistryV3Service: NationalRegistryV3Service,
    private readonly s3Service: S3Service,
    private readonly notificationsService: NotificationsService,
  ) {
    super(ApplicationTypes.PARENTAL_LEAVE_V2)
  }

  private shouldUseMockData(application: Application): boolean {
    // The deployed environment, not NODE_ENV: every deployed image sets
    // NODE_ENV to production, which kept mock applications out of dev and staging.
    if (isRunningOnEnvironment('production')) {
      return false
    }

    if (
      getValueViaPath<string>(application.answers, 'mock.useMockData', NO) ===
      YES
    ) {
      return true
    }

    // A mock application that has been "sent" holds the mock fund id. It was
    // never really sent to VMST, so there is no record there to send to or
    // validate against, whatever its mock answer says now.
    const { applicationFundId } = getApplicationExternalData(
      application.externalData,
    )

    return applicationFundId === MOCK_APPLICATION_FUND_ID
  }

  /**
   * Logs a failure with its full detail and returns a translated error for the
   * applicant. The detail stays in the log: it is English, may hold VMST's
   * reasons about the applicant's data, and is shown to whoever triggered the
   * action, who can be the employer.
   */
  private internalError(
    context: string,
    detail: string,
    summary: StaticTextObject,
  ): TemplateApiError {
    this.logger.error(`Parental leave: ${context}: ${detail}`)

    return new TemplateApiError(
      {
        title: errorMessages.vmstErrorTitle,
        summary,
      },
      500,
    )
  }

  /**
   * The reason a VMST call failed. In production the generated client rejects
   * with the raw `Response`; only the parts of its body that are safe to log
   * are kept.
   */
  private async describeError(error: unknown): Promise<string> {
    return describeVmstError(error)
  }

  private assertExistingApplicationHasFundId(application: Application) {
    const statesThatUpdateExistingApplication: string[] = [
      States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
      States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      States.EMPLOYER_APPROVE_EDITS,
      States.VINNUMALASTOFNUN_APPROVE_EDITS,
      States.RESIDENCE_GRANT_APPLICATION,
      States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE,
    ]

    if (!statesThatUpdateExistingApplication.includes(application.state)) {
      return
    }

    const { applicationFundId } = getApplicationExternalData(
      application.externalData,
    )

    if (!applicationFundId) {
      throw this.internalError(
        'Missing applicationFundId',
        `application ${application.id} is in ${application.state} but has no fund id from navId or sendApplication`,
        errorMessages.vmstApplicationNotFound,
      )
    }
  }

  async getChildren({ application, auth }: TemplateApiModuleActionProps) {
    return this.childrenService.provideChildren(application, auth.nationalId)
  }

  private async getVmstApplication(
    application: Application,
  ): Promise<NewApplication | null> {
    const { application: vmstApplication } =
      await this.applicationApi.applicationGetApplication({
        applicationId: getVmstApplicationId(application),
      })

    return vmstApplication ?? null
  }

  /**
   * Data provider. Gathers what VMST holds for the applicant with the other
   * external data, so starting a follow-up needs no further VMST requests: the
   * per-applicant list, which the children provider reads instead of fetching
   * it again, and each listed leave's VMST application, which the list lacks
   * fields of (the other parent's name, how the first period starts).
   */
  async getVMSTParentalLeaves({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<VmstParentalLeavesData | null> {
    if (this.shouldUseMockData(application)) {
      return null
    }

    let parentalLeaves: ParentalLeave[] | null
    try {
      const response =
        await this.parentalLeaveApi.parentalLeaveGetParentalLeaves({
          nationalRegistryId: auth.nationalId,
        })
      parentalLeaves = response.parentalLeaves ?? []
    } catch (e) {
      this.logger.warn(
        `Parental leave: could not fetch parental leaves for application ${
          application.id
        }: ${await this.describeError(e)}`,
      )
      return { parentalLeaves: null, applications: {} }
    }

    const applications: Record<string, NewApplication> = {}
    await Promise.all(
      parentalLeaves.map(async ({ applicationId }) => {
        try {
          const response = await this.applicationApi.applicationGetApplication({
            applicationId,
          })
          if (response.application) {
            applications[applicationId] = response.application
          }
        } catch (e) {
          // A follow-up of this leave fetches it again on leaving prerequisites
          this.logger.warn(
            `Parental leave: could not fetch VMST application ${applicationId}: ${await this.describeError(
              e,
            )}`,
          )
        }
      }),
    )

    return { parentalLeaves, applications }
  }

  /** Stops keeping the gathered VMST data once prerequisites is left. */
  async clearVMSTParentalLeaves() {
    return null
  }

  /** The follow-up's VMST application as gathered with the external data. */
  private getStoredVmstApplication(
    application: Application,
  ): NewApplication | undefined {
    return getStoredVmstParentalLeaves(application)?.applications?.[
      getVmstApplicationId(application)
    ]
  }

  /**
   * The VMST application a follow-up continues. Throws when VMST fails or does
   * not return it: without it the change form would open without the periods,
   * payments and rights it is prefilled from, and prerequisites never re-runs.
   */
  private async getFollowUpVmstApplication(
    application: Application,
  ): Promise<NewApplication> {
    let vmstApplication: NewApplication | null
    try {
      vmstApplication = await this.getVmstApplication(application)
    } catch (e) {
      throw this.internalError(
        `Could not fetch VMST application ${getVmstApplicationId(
          application,
        )} for application ${application.id}`,
        await this.describeError(e),
        errorMessages.vmstFollowUpUnavailable,
      )
    }

    if (!vmstApplication) {
      throw this.internalError(
        `Could not fetch VMST application ${getVmstApplicationId(
          application,
        )} for application ${application.id}`,
        'VMST returned no application',
        errorMessages.vmstFollowUpUnavailable,
      )
    }

    return vmstApplication
  }

  /**
   * The VMST application for a lookup. Strict when a follow-up leaves
   * prerequisites, where it gets the data its change form is built from.
   * Best effort when a later state re-syncs: a failure keeps the data stored.
   */
  private async lookupVmstApplication(
    application: Application,
  ): Promise<NewApplication | null> {
    if (application.state === States.PREREQUISITES) {
      return (
        this.getStoredVmstApplication(application) ??
        this.getFollowUpVmstApplication(application)
      )
    }

    try {
      return await this.getVmstApplication(application)
    } catch (e) {
      this.logger.warn(
        `Could not fetch VMST application for application ${
          application.id
        }: ${await this.describeError(e)}`,
      )
      return null
    }
  }

  // VMST only returns these on the per-applicant list, not on the application
  // itself. Best effort: a failed lookup must not lose the application data.
  private async getVmstFollowUpFields(
    application: Application,
  ): Promise<VmstFollowUpFields> {
    try {
      const parentalLeaves =
        getStoredVmstParentalLeaves(application)?.parentalLeaves ??
        (
          await this.parentalLeaveApi.parentalLeaveGetParentalLeaves({
            nationalRegistryId: application.applicant,
          })
        ).parentalLeaves
      const vmstApplicationId = getVmstApplicationId(application)
      const match = parentalLeaves?.find(
        ({ applicationId }) => applicationId === vmstApplicationId,
      )

      if (!match) {
        return {}
      }

      const { language, otherParentBlocked, noOfChildren, adoptionDate } = match

      return { language, otherParentBlocked, noOfChildren, adoptionDate }
    } catch (e) {
      this.logger.warn(
        `Could not fetch parental leaves for applicationId: ${application.id} with error: ${e}`,
      )
    }

    return {}
  }

  /**
   * Refuses a follow-up application whose leave VMST does not list for the
   * applicant.
   *
   * `answers.initialQuery` comes from the browser (see `initialQueryParameter`
   * on the template) and is the VMST id of the leave being continued. VMST's
   * `GET /applications/{id}` does not check ownership, so the id is only
   * trusted when the applicant's own VMST parental-leaves list contains it
   * (`getPreviousVmstLeave`). Runs on exit from prerequisites, after
   * `setChildrenInformation` has stored that list's links.
   */
  async verifyFollowUpLeave({ application }: TemplateApiModuleActionProps) {
    const initialQuery = getValueViaPath<string>(
      application.answers,
      'initialQuery',
    )

    if (!initialQuery || getPreviousVmstLeave(application)) {
      return
    }

    // The ids stay in the log; the applicant gets a translated explanation.
    this.logger.warn(
      `Parental leave: VMST does not list ${initialQuery} for application ${application.id}`,
    )

    throw new TemplateApiError(
      {
        title: errorMessages.followUpLeaveNotFoundTitle,
        summary: errorMessages.followUpLeaveNotFoundSummary,
      },
      400,
    )
  }

  async getPerson({ auth }: TemplateApiModuleActionProps) {
    const person = await this.nationalRegistryV3Service.getIndividual(
      auth.nationalId,
      auth,
    )

    const spouse = await this.nationalRegistryV3Service.getSpouse({
      auth,
      params: undefined,
    } as TemplateApiModuleActionProps<NationalRegistrySpouseV3>)

    return (
      person && {
        spouse: spouse && {
          nationalId: spouse.nationalId,
          name: spouse.name,
        },
        fullname: person.fullName,
        genderCode: person.genderCode,
      }
    )
  }

  // If no children information from Heilsuvera, or the applicant picked
  // "Ný umsókn", and the application is birth | adoption | foster care |
  // without primary parent we make a children data
  async setChildrenInformation({ application }: TemplateApiModuleActionProps) {
    const {
      noPrimaryParentBirthDate,
      newChildBirthDate,
      noChildrenFoundTypeOfApplication,
      fosterCareOrAdoptionDate,
      fosterCareOrAdoptionBirthDate,
    } = getApplicationAnswers(application.answers)

    // This replaces the whole `children` external data, so the VMST links the
    // children provider stored are passed on: they are how a follow-up proves
    // which leave it continues (`getPreviousVmstLeave`).
    const { applicantGenderCode, children, childApplicationLinks } =
      getApplicationExternalData(application.externalData)

    // The applicant picked a registry child after answering the
    // no-children-found screens: keep that child, not one built from them.
    if (!isNoChildrenFoundPath(application.answers)) {
      return { children, childApplicationLinks }
    }

    if (noChildrenFoundTypeOfApplication === BIRTH) {
      const child: ChildInformation = {
        hasRights: true,
        remainingDays: 180,
        expectedDateOfBirth: newChildBirthDate,
        parentalRelation: ParentalRelations.primary,
      }

      return { children: [child], childApplicationLinks }
    } else if (noChildrenFoundTypeOfApplication === OTHER_NO_CHILDREN_FOUND) {
      const child: ChildInformation = {
        hasRights: true,
        remainingDays: 180,
        expectedDateOfBirth: noPrimaryParentBirthDate,
        parentalRelation: ParentalRelations.secondary,
        primaryParentNationalRegistryId: '',
        primaryParentGenderCode: applicantGenderCode,
        primaryParentTypeOfApplication: noChildrenFoundTypeOfApplication,
      }

      return { children: [child], childApplicationLinks }
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

      return { children: [child], childApplicationLinks }
    } else {
      // "normal application" - children found just return them
      return { children, childApplicationLinks }
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
    if (application.state === States.PREREQUISITES) {
      const storedVmstApplication = this.getStoredVmstApplication(application)
      if (storedVmstApplication) {
        return { dateOfBirth: storedVmstApplication.dateOfBirth ?? '' }
      }
      // A first-time application is not at VMST yet
      if (!hasPreviousApplication(application)) {
        return { dateOfBirth: '' }
      }
    }

    try {
      const vmstApplication = await this.getVmstApplication(application)
      return {
        dateOfBirth: vmstApplication?.dateOfBirth ?? '',
      }
    } catch (e) {
      this.logger.error('Failed to fetch application information', e)
    }

    return {
      dateOfBirth: '',
    }
  }

  async assignOtherParent({ application }: TemplateApiModuleActionProps) {
    if (this.shouldUseMockData(application)) {
      return
    }

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
        const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeaveV2.slug}/${application.id}`

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

  async notifyApplicantOfRejection({
    application,
  }: TemplateApiModuleActionProps) {
    if (this.shouldUseMockData(application)) {
      return
    }

    const rejectedBy = getRejectedBy(application.answers)
    if (!rejectedBy) {
      return
    }

    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    await this.notificationsService.sendNotification({
      type: NotificationType.ParentalLeaveRejected,
      messageParties: {
        recipient: application.applicant,
      },
      applicationId: application.id,
      args: {
        rejectedBy: rejectedByNames[rejectedBy],
        applicationLink: `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeaveV2.slug}/${application.id}`,
      },
    })
  }

  async assignEmployer({ application }: TemplateApiModuleActionProps) {
    if (this.shouldUseMockData(application)) {
      return
    }

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

  async createRightsDTO(application: Application): Promise<ApplicationRight[]> {
    const { applicationType, otherParent, isRequestingRights, periods } =
      getApplicationAnswers(application.answers)

    // In a change application these are the rights VMST holds, with the days
    // the applicant now requests or gives
    const VMSTApplicationRights = getVMSTRightsWithTransfer(application)

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
      rightsArray: ApplicationRight[],
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
  ): Promise<{ rightsDTO: ApplicationRight[]; periodsDTO: Period[] }> {
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

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    if (this.shouldUseMockData(application)) {
      return { id: MOCK_APPLICATION_FUND_ID }
    }

    const {
      isSelfEmployed,
      isReceivingUnemploymentBenefits,
      applicationType,
      employerLastSixMonths,
      employers,
      periods,
      firstPeriodStart,
    } = getApplicationAnswers(application.answers)
    const nationalRegistryId = application.applicant
    const type = getType(application)
    this.assertExistingApplicationHasFundId(application)

    // Inside the try so a failure here reaches the applicant as a translated
    // reason, not a generic error
    try {
      const attachments = await this.getAttachments(application)
      const { periodsDTO, rightsDTO } = await this.preparePeriodsAndRightsDTO(
        application,
        periods,
        firstPeriodStart,
      )

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
      throw this.internalError(
        'Failed to send the parental leave application',
        await this.describeError(e),
        errorMessages.vmstSendApplicationFailed,
      )
    }
  }

  /**
   * Runs after `sendApplication` on the same entry. Keeps the first id VMST
   * returned, so a later failed resend, which overwrites `sendApplication`,
   * cannot make the application look unsent.
   */
  async setSentToVMST({ application }: TemplateApiModuleActionProps) {
    const previousId = getValueViaPath<string>(
      application.externalData,
      'sentToVMST.data.id',
    )
    const sentId = getValueViaPath<string>(
      application.externalData,
      'sendApplication.data.id',
    )

    return { id: previousId || sentId || null }
  }

  async validateApplication({ application }: TemplateApiModuleActionProps) {
    const { periods, firstPeriodStart } = getApplicationAnswers(
      application.answers,
    )

    // The periods screen checks this on Continue, but a deleted period is
    // saved at once, so the plan is checked again before anything is sent.
    const shortPeriodError = getShortPeriodWithoutPredecessorError(periods)
    if (shortPeriodError) {
      throw new TemplateApiError(
        {
          title: errorMessages.invalidPeriodsTitle,
          summary: shortPeriodError,
        },
        400,
      )
    }

    if (this.shouldUseMockData(application)) {
      return
    }

    const nationalRegistryId = application.applicant
    // The `previousState === RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE` guard that
    // used to sit here is gone along with the `previousState` history stack. It was
    // already unreachable: the no-birth-date state has no `validateApplication` on
    // exit, and `setPreviousState` deliberately preserved the pre-residence-grant
    // origin, so the value it tested for never reached this call.
    this.assertExistingApplicationHasFundId(application)

    try {
      const attachments = await this.getAttachments(application)
      const { periodsDTO, rightsDTO } = await this.preparePeriodsAndRightsDTO(
        application,
        periods,
        firstPeriodStart,
      )

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
      throw this.internalError(
        'Failed to validate the parental leave application',
        await this.describeError(e),
        errorMessages.vmstValidateApplicationFailed,
      )
    }
  }

  async setVMSTPeriods({ application }: TemplateApiModuleActionProps) {
    if (this.shouldUseMockData(application)) {
      const periods = getApplicationAnswers(application.answers).periods

      return periods.map((period) => ({
        from: period.startDate,
        to: period.endDate,
        ratio: period.ratio ?? '100',
        approved: true,
        paid: period.paid ?? false,
        rightsCodePeriod: period.rightCodePeriod ?? 'M-L-GR',
        days: period.daysToUse ?? '0',
      }))
    }

    // First-time application: no VMST record yet, so the lookup would only
    // waste a round-trip.
    if (!hasPreviousApplication(application)) {
      return null
    }

    const vmstApplication = await this.lookupVmstApplication(application)

    return vmstApplication?.periods ?? null
  }

  async setApplicationInformation({
    application,
  }: TemplateApiModuleActionProps) {
    if (
      this.shouldUseMockData(application) ||
      !hasPreviousApplication(application)
    ) {
      return null
    }

    const [vmstApplication, followUpFields] = await Promise.all([
      this.lookupVmstApplication(application),
      this.getVmstFollowUpFields(application),
    ])

    return vmstApplication ? { ...vmstApplication, ...followUpFields } : null
  }

  async setApplicationFundId({ application }: TemplateApiModuleActionProps) {
    if (this.shouldUseMockData(application)) {
      return MOCK_APPLICATION_FUND_ID
    }

    const { applicationFundId } = getApplicationExternalData(
      application.externalData,
    )

    if (applicationFundId) {
      return applicationFundId
    }

    if (!hasPreviousApplication(application)) {
      return null
    }

    const vmstApplication = await this.lookupVmstApplication(application)

    return vmstApplication?.applicationFundId || null
  }

  async setApplicationRights({ application }: TemplateApiModuleActionProps) {
    if (this.shouldUseMockData(application)) {
      return null
    }

    if (!hasPreviousApplication(application)) {
      return null
    }

    const vmstApplication = await this.lookupVmstApplication(application)

    return vmstApplication?.applicationRights ?? null
  }

  async setOtherParent({ application }: TemplateApiModuleActionProps) {
    if (this.shouldUseMockData(application)) {
      const { otherParentId, otherParentName } = getApplicationAnswers(
        application.answers,
      )
      return {
        otherParentId: otherParentId ?? '',
        otherParentName: otherParentName ?? '',
      }
    }

    if (!hasPreviousApplication(application)) {
      return null
    }

    const vmstApplication = await this.lookupVmstApplication(application)

    if (!vmstApplication) {
      return null
    }

    const { otherParentId, otherParentName } = vmstApplication

    return { otherParentId, otherParentName }
  }
}

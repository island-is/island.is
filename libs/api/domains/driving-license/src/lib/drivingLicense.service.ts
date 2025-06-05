import { Inject, Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  TeachingRightsStatus,
  StudentInformation,
  NewDrivingLicenseInput,
  NewDrivingLicenseResult,
  NewDrivingAssessmentResult,
  RequirementKey,
  ApplicationEligibility,
  QualityPhotoResult,
  DrivingLicenseApplicationType,
  NewTemporaryDrivingLicenseInput,
  ApplicationEligibilityRequirement,
  QualitySignatureResult,
  NewBEDrivingLicenseInput,
  DrivinglicenseDuplicateValidityStatus,
  PostRenewal65AndOverInput,
} from './drivingLicense.type'
import {
  CanApplyErrorCodeBFull,
  CanApplyErrorCodeBTemporary,
  Disqualification,
  DriversLicense,
  DrivingAssessment,
  DrivingLicenseApi,
  TeacherV4,
  PostTemporaryLicenseWithHealthDeclaration as HealthDeclaration,
  DriverLicenseWithoutImages,
} from '@island.is/clients/driving-license'
import {
  BLACKLISTED_JURISDICTION,
  DRIVING_ASSESSMENT_MAX_AGE,
} from './util/constants'
import sortTeachers from './util/sortTeachers'
import { StudentAssessment } from '..'
import { FetchError } from '@island.is/clients/middlewares'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import {
  hasLocalResidence,
  hasResidenceHistory,
  mapResidence,
} from './util/hasResidenceHistory'
import { info } from 'kennitala'
import { computeCountryResidence } from '@island.is/residence-history'
import { Jurisdiction } from './graphql/models'
import addMonths from 'date-fns/addMonths'

const LOGTAG = '[api-domains-driving-license]'

@Injectable()
export class DrivingLicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly drivingLicenseApi: DrivingLicenseApi,
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  async getDrivingLicense(token: string): Promise<DriversLicense | null> {
    try {
      return await this.drivingLicenseApi.getCurrentLicense({
        token,
      })
    } catch (e) {
      return this.handleGetLicenseError(e)
    }
  }

  async getAllDriverLicenses(
    token: string,
  ): Promise<DriverLicenseWithoutImages[]> {
    const drivingLicesnes = await this.drivingLicenseApi
      .getAllDriverLicenses(token)
      .catch((e) => {
        this.logger.warn(`Error fetching all driver licenses`, {
          error: e,
          category: LOGTAG,
        })
      })
    return drivingLicesnes ?? []
  }

  async legacyGetDrivingLicense(
    nationalId: User['nationalId'],
    token?: string,
  ): Promise<DriversLicense | null> {
    try {
      return await this.drivingLicenseApi.legacyGetCurrentLicense({
        nationalId,
        token,
      })
    } catch (e) {
      return this.handleGetLicenseError(e)
    }
  }

  private handleGetLicenseError(e: unknown) {
    // The goal of this is to basically normalize the known semi-error responses
    // so both those who are not found and those who have invalid/expired licenses will return nothing
    if (e instanceof Error && e.name === 'FetchError') {
      const err = e as unknown as FetchError

      if ([400, 404].includes(err.status)) {
        return null
      }
    }

    throw e
  }

  // Disqualification is a bit tricky
  // You're not allowed to have had a disqualification in the last 12 months
  // You're not allowed to have an active disqualification
  // Some disqualifications do not have an end date, so we have to assume they're still active
  private isDisqualified(
    from: Disqualification['from'],
    to: Disqualification['to'],
  ): boolean {
    if (!from) {
      return false
    }

    if (!to && from) {
      return true
    }

    const now = Date.now()
    const year = 1000 * 3600 * 24 * 365.25
    const twelveMonthsAgo = new Date(Date.now() - year)

    // With the two checks above, 'to' is guaranteed to be defined
    // Either !from returns or !to returns since '!from || from' is a tautology
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const activeDisqualification = from.getTime() < now && now < to!.getTime()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const disqualificationInTheLastTwelveMonths = to! > twelveMonthsAgo

    return activeDisqualification || disqualificationInTheLastTwelveMonths
  }

  async getStudentInformation(
    nationalId: string,
  ): Promise<StudentInformation | null> {
    let licenses
    try {
      licenses = await this.drivingLicenseApi.getAllLicensesV4({ nationalId })
    } catch (e) {
      this.logger.error(`${LOGTAG} Error fetching student information`, e)
      return this.handleGetLicenseError(e)
    }

    const [drivingLicense] = licenses

    if (!drivingLicense) {
      return null
    }

    return {
      name: drivingLicense.name,
    }
  }

  async getTeachersV4(): Promise<TeacherV4[]> {
    const teachers = await this.drivingLicenseApi.getTeachersV4()

    return teachers.sort(sortTeachers)
  }

  async getTeachingRights(input: {
    token: User['authorization']
    nationalId: User['nationalId']
  }): Promise<TeachingRightsStatus> {
    const hasTeachingRights = await this.drivingLicenseApi.getIsTeacher({
      token: input.token,
    })

    return {
      nationalId: input.nationalId,
      hasTeachingRights,
    }
  }

  async getListOfJurisdictions(): Promise<Jurisdiction[]> {
    const embaetti = await this.drivingLicenseApi.getListOfJurisdictions()
    return embaetti.filter(({ id }) => id !== BLACKLISTED_JURISDICTION)
  }

  async getDrivingAssessmentResult(
    token: string,
  ): Promise<DrivingAssessment | null> {
    try {
      return await this.drivingLicenseApi.getDrivingAssessment({
        token,
      })
    } catch (e) {
      if ((e as { status: number })?.status === 404) {
        return null
      }

      throw e
    }
  }

  async getLearnerMentorEligibility(
    user: User,
    nationalId: string,
  ): Promise<ApplicationEligibility> {
    const license = await this.legacyGetDrivingLicense(
      nationalId,
      user.authorization.replace('Bearer ', ''), // removes the Bearer prefix,
    )

    const year = 1000 * 3600 * 24 * 365.25
    const fiveYearsAgo = new Date(Date.now() - year * 5)

    const categoryB = license?.categories
      ? license.categories.find(
          (category) => category.nr?.toLocaleUpperCase() === 'B',
        )
      : undefined

    const isDisqualified = this.isDisqualified(
      license?.disqualification?.from,
      license?.disqualification?.to,
    )

    const requirements: ApplicationEligibilityRequirement[] = [
      {
        key: RequirementKey.hasDeprivation,
        requirementMet: !isDisqualified,
      },
      {
        key: RequirementKey.personNotAtLeast24YearsOld,
        requirementMet: info(nationalId).age >= 24,
      },
      {
        key: RequirementKey.hasHadValidCategoryForFiveYearsOrMore,
        requirementMet:
          categoryB && categoryB.issued
            ? categoryB.issued < fiveYearsAgo
            : false,
      },
    ]

    // only eligible if we dont find an unmet requirement
    const isEligible = !requirements.find(
      ({ requirementMet }) => requirementMet === false,
    )

    return {
      requirements,
      isEligible,
    }
  }

  async getApplicationEligibility(
    user: User,
    nationalId: string,
    type: DrivingLicenseApplicationType,
  ): Promise<ApplicationEligibility> {
    const token = user.authorization.replace('Bearer ', '')
    const assessmentResult = await this.getDrivingAssessmentResult(token)
    const hasFinishedSchool =
      await this.drivingLicenseApi.getHasFinishedOkugerdi({
        token,
      })

    const residenceHistory =
      await this.nationalRegistryXRoadService.getNationalRegistryResidenceHistory(
        nationalId,
      )

    const residence = mapResidence(residenceHistory)
    const residenceTime = computeCountryResidence(residence)
    const localRecidencyHistory = hasResidenceHistory(residence)
    const localRecidency = hasLocalResidence(residence)

    const canApply = await this.canApplyFor(type, token)

    const requirements: ApplicationEligibilityRequirement[] = [
      ...(type === 'B-full'
        ? [
            {
              key: RequirementKey.drivingAssessmentMissing,
              requirementMet:
                (assessmentResult?.created?.getTime() ?? 0) >
                Date.now() - DRIVING_ASSESSMENT_MAX_AGE,
            },
            {
              key: RequirementKey.drivingSchoolMissing,
              requirementMet: hasFinishedSchool,
            },
            {
              key: RequirementKey.currentLocalResidency,
              requirementMet: localRecidency,
              daysOfResidency: residenceTime ? residenceTime['IS'] : 0,
            },
          ]
        : []),
      ...(type === 'B-temp'
        ? [
            {
              key: RequirementKey.localResidency,
              requirementMet: localRecidencyHistory,
              daysOfResidency: residenceTime ? residenceTime['IS'] : 0,
            },
          ]
        : []),
      {
        key: this.canApplyErrorCodeToRequirementKey(canApply.errorCode),
        requirementMet: canApply.result,
      },
    ]

    // only eligible if we dont find an unmet requirement
    const isEligible = !requirements.find(
      ({ requirementMet }) => requirementMet === false,
    )

    return {
      requirements,
      isEligible,
    }
  }

  private canApplyErrorCodeToRequirementKey(
    errorCode?: CanApplyErrorCodeBFull | CanApplyErrorCodeBTemporary,
  ): RequirementKey {
    if (errorCode === undefined) {
      return RequirementKey.deniedByService
    }

    switch (errorCode) {
      case 'HAS_DEPRIVATION':
        return RequirementKey.hasDeprivation
      case 'HAS_NO_PHOTO':
        return RequirementKey.hasNoPhoto
      case 'HAS_NO_SIGNATURE':
        return RequirementKey.hasNoSignature
      case 'HAS_POINTS':
        return RequirementKey.hasPoints
      case 'NO_LICENSE_FOUND':
        return RequirementKey.noLicenseFound
      case 'NO_TEMP_LICENSE':
        return RequirementKey.noTempLicense
      case 'PERSON_NOT_17_YEARS_OLD':
        return RequirementKey.personNot17YearsOld
      case 'PERSON_NOT_FOUND_IN_NATIONAL_REGISTRY':
        return RequirementKey.personNotFoundInNationalRegistry
      default:
        this.logger.warn(`${LOGTAG} unhandled can apply error code`, errorCode)

        return RequirementKey.deniedByService
    }
  }

  async canApplyFor(
    type: 'B-full' | 'B-temp' | 'BE' | 'B-full-renewal-65',
    token: string,
  ) {
    if (type === 'B-full-renewal-65') {
      return this.drivingLicenseApi.getCanApplyForRenewal65({
        token,
      })
    } else if (type === 'B-full') {
      return this.drivingLicenseApi.getCanApplyForCategoryFull({
        category: 'B',
        token,
      })
    } else if (type === 'BE') {
      return this.drivingLicenseApi.getCanApplyForCategoryFull({
        category: 'BE',
        token,
      })
    } else if (type === 'B-temp') {
      return this.drivingLicenseApi.getCanApplyForCategoryTemporary({
        token,
      })
    } else {
      throw new Error('unhandled license type')
    }
  }

  async studentCanGetPracticePermit(params: {
    studentSSN: string
    token: string
  }) {
    const { studentSSN, token } = params
    return await this.drivingLicenseApi.postCanApplyForPracticePermit({
      studentSSN,
      token,
    })
  }

  async canGetNewDuplicate(
    token: string,
  ): Promise<DrivinglicenseDuplicateValidityStatus> {
    const license = await this.drivingLicenseApi.getCurrentLicense({
      token,
    })

    if (license.comments?.some((comment) => comment?.nr == '400')) {
      return {
        canGetNewDuplicate: false,
        meta: '',
      }
    }

    const inSixMonths = addMonths(new Date(), 6)

    for (const category of license.categories ?? []) {
      if (category.expires === null) {
        // Technically this will result in the wrong error message
        // towards the user, however, contacting the registry
        // with the category information should result in the error
        // being discovered anyway. We log it here for good measure though.
        this.logger.warn(`${LOGTAG} Category has no expiration date`, {
          category: category.name,
        })
        return {
          canGetNewDuplicate: false,
          meta: category.name,
        }
      }

      if (category.expires < inSixMonths) {
        return {
          canGetNewDuplicate: false,
          meta: category.name,
        }
      }
    }

    return {
      canGetNewDuplicate: true,
      meta: '',
    }
  }

  async drivingLicenseDuplicateSubmission(params: {
    districtId: number
    token: string
    stolenOrLost: boolean
    pickUpLicense: boolean
    imageBiometricsId: string | null
  }): Promise<number> {
    const {
      districtId,
      token,
      stolenOrLost,
      pickUpLicense,
      imageBiometricsId,
    } = params
    return await this.drivingLicenseApi.postApplicationNewCollaborative({
      districtId,
      stolenOrLost,
      token,
      pickUpLicense,
      imageBiometricsId,
    })
  }

  async newDrivingAssessment(
    nationalIdStudent: string,
    nationalIdTeacher: User['nationalId'],
  ): Promise<NewDrivingAssessmentResult> {
    await this.drivingLicenseApi.postCreateDrivingAssessment({
      nationalIdStudent,
      nationalIdTeacher,
      dateOfAssessment: new Date(),
    })

    return {
      success: true,
      errorMessage: null,
    }
  }

  async newTemporaryDrivingLicense(
    nationalId: User['nationalId'],
    auth: User['authorization'],
    input: NewTemporaryDrivingLicenseInput,
  ): Promise<NewDrivingLicenseResult> {
    const success =
      await this.drivingLicenseApi.postCreateDrivingLicenseTemporary({
        willBringHealthCertificate: input.needsToPresentHealthCertificate,
        willBringQualityPhoto: input.needsToPresentQualityPhoto,
        jurisdictionId: input.jurisdictionId,
        nationalIdTeacher: input.teacherNationalId,
        nationalIdApplicant: nationalId,
        sendLicenseInMail: input.sendLicenseInMail,
        email: input.email,
        phone: input.phone,
        auth,
      })

    return {
      success,
      errorMessage: null,
    }
  }

  async newDrivingLicense(
    nationalId: User['nationalId'],
    input: NewDrivingLicenseInput,
  ): Promise<NewDrivingLicenseResult> {
    const response = await this.drivingLicenseApi.postCreateDrivingLicenseFull({
      category: input.licenseCategory,
      jurisdictionId: input.jurisdictionId,
      willBringHealthCertificate: input.needsToPresentHealthCertificate,
      nationalIdApplicant: nationalId,
      willBringQualityPhoto: input.needsToPresentQualityPhoto,
      sendLicenseInMail: input.sendLicenseInMail,
      sendLicenseToAddress: '',
    })

    return {
      success: response,
      errorMessage: null,
    }
  }

  async renewDrivingLicense65AndOver(
    auth: User['authorization'],
    input: PostRenewal65AndOverInput,
  ): Promise<NewDrivingLicenseResult> {
    const response = await this.drivingLicenseApi.postRenewLicenseOver65({
      input,
      auth: auth,
    })
    return {
      success: response.isOk ?? false,
      errorMessage: response.errorCode ?? null,
    }
  }

  async applyForBELicense(
    nationalId: User['nationalId'],
    auth: User['authorization'],
    input: NewBEDrivingLicenseInput,
  ): Promise<NewDrivingLicenseResult> {
    const response = await this.drivingLicenseApi.postApplyForBELicense({
      nationalIdApplicant: nationalId,
      token: auth,
      jurisdictionId: input.jurisdiction,
      instructorSSN: input.instructorSSN,
      email: input.studentEmail,
      phoneNumber: input.primaryPhoneNumber,
    })

    return {
      success: response,
      errorMessage: null,
    }
  }

  async getQualityPhotoUri(
    token: User['authorization'],
  ): Promise<string | null> {
    const image = await this.drivingLicenseApi.getQualityPhoto({
      token,
    })
    const qualityPhoto = image?.data?.length
      ? `data:image/jpeg;base64,${image?.data.substr(1, image.data.length - 2)}`
      : null

    return qualityPhoto
  }

  async getQualityPhoto(
    token: User['authorization'],
  ): Promise<QualityPhotoResult> {
    const hasQualityPhoto = await this.drivingLicenseApi.getHasQualityPhoto({
      token,
    })

    return {
      hasQualityPhoto,
    }
  }

  async getQualitySignatureUri(
    token: User['authorization'],
  ): Promise<string | null> {
    const image = await this.drivingLicenseApi.getQualitySignature({
      token,
    })
    const qualitySignature = image?.data?.length
      ? `data:image/jpeg;base64,${image?.data.substr(1, image.data.length - 2)}`
      : null

    return qualitySignature
  }

  async getQualitySignature(
    token: User['authorization'],
  ): Promise<QualitySignatureResult> {
    const hasQualitySignature =
      await this.drivingLicenseApi.getHasQualitySignature({
        token,
      })

    return {
      hasQualitySignature,
    }
  }

  async getDrivingAssessment(token: string): Promise<StudentAssessment | null> {
    const assessment = await this.drivingLicenseApi.getDrivingAssessment({
      token,
    })

    if (!assessment) {
      return null
    }

    let teacherName: string | null
    if (assessment.nationalIdTeacher) {
      const teacherLicense = await this.legacyGetDrivingLicense(
        assessment.nationalIdTeacher,
      )
      teacherName = teacherLicense?.name || null
    } else {
      teacherName = null
    }

    return {
      studentNationalId: assessment.nationalIdStudent,
      teacherNationalId: assessment.nationalIdTeacher,
      teacherName,
    }
  }

  async postHealthDeclaration(
    nationalId: User['nationalId'],
    healthDeclaration: HealthDeclaration,
    token?: string,
  ): Promise<void> {
    await this.drivingLicenseApi.postTemporaryLicenseWithHealthDeclaratio({
      nationalId: nationalId,
      token: token,
      healthDecleration: healthDeclaration,
    })
  }
}

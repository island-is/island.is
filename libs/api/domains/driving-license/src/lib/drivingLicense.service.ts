import { Inject, Injectable } from '@nestjs/common'
import type { Auth, User } from '@island.is/auth-nest-tools'
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
  NewDrivingLicenseWithHealthDeclarationInput,
  NewTemporaryDrivingLicenseWithHealthDeclarationInput,
  DrivinglicenseDuplicateValidityStatus,
  NewRenewal65DrivingLicenseInput,
} from './drivingLicense.type'
import {
  Disqualification,
  DriversLicense,
  DrivingAssessment,
  DrivingLicenseApi,
  TeacherV4,
  ModelsV5PostTemporaryLicenseWithHealthDeclaration as HealthDeclaration,
  DriverLicenseWithoutImages,
} from '@island.is/clients/driving-license'
import { BLACKLISTED_JURISDICTION } from './util/constants'
import sortTeachers from './util/sortTeachers'
import { StudentAssessment } from '..'
import { FetchError } from '@island.is/clients/middlewares'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'
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
    private nationalRegistryV3: NationalRegistryV3ApplicationsClientService,
  ) {}

  async getDrivingLicense(auth: Auth): Promise<DriversLicense | null> {
    try {
      return await this.drivingLicenseApi.getCurrentLicense({
        auth,
      })
    } catch (e) {
      return this.handleGetLicenseError(e)
    }
  }

  async getAllDriverLicenses(
    auth: Auth,
  ): Promise<DriverLicenseWithoutImages[]> {
    const drivingLicesnes = await this.drivingLicenseApi
      .getAllDriverLicenses(auth)
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
    auth?: Auth,
  ): Promise<DriversLicense | null> {
    try {
      return await this.drivingLicenseApi.legacyGetCurrentLicense({
        nationalId,
        auth,
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
    auth: Auth
    nationalId: User['nationalId']
  }): Promise<TeachingRightsStatus> {
    const hasTeachingRights = await this.drivingLicenseApi.getIsTeacher({
      auth: input.auth,
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
    auth: Auth,
  ): Promise<DrivingAssessment | null> {
    try {
      return await this.drivingLicenseApi.getDrivingAssessment({
        auth,
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
    const license = await this.legacyGetDrivingLicense(nationalId, user)

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
    const assessmentResult = await this.getDrivingAssessmentResult(user)
    const hasFinishedSchool =
      await this.drivingLicenseApi.getHasFinishedOkugerdi({
        auth: user,
      })

    const residenceHistory = await this.nationalRegistryV3.getResidenceHistory(
      nationalId,
      user,
    )

    const residence = mapResidence(residenceHistory ?? [])
    const residenceTime = computeCountryResidence(residence)
    const localRecidencyHistory = hasResidenceHistory(residence)
    const localRecidency = hasLocalResidence(residence)

    const canApply = await this.canApplyFor(type, user)

    // For an unmet can-apply denial, resolve RLS's own description for the raw
    // error code (both languages) so the UI can surface it instead of the
    // generic fallback for codes we don't curate ourselves. Applies to all
    // license types: it's best-effort fallback only — curated frontend copy
    // still wins where it exists, and an unknown/unmatched code still falls back
    // to the generic message. Both languages are attached; the frontend renders
    // the one matching its locale.
    const canApplyMessages =
      !canApply.result && canApply.errorCode
        ? await this.describeErrorCode(canApply.errorCode)
        : null

    const requirements: ApplicationEligibilityRequirement[] = [
      ...(type === 'B-full'
        ? [
            {
              key: RequirementKey.drivingAssessmentMissing,
              // Only completion matters — a driving assessment does not expire
              // (Samgongustofa, 2026-08-31), and RLS applies no age rule on its
              // side either. The 182-day window this replaced dated from the
              // original 2021 template and wrongly blocked applicants whose
              // assessment was older than ~6 months.
              requirementMet: assessmentResult != null,
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
        ...(canApply.errorCode ? { errorCode: canApply.errorCode } : {}),
        ...(canApplyMessages?.is ? { messageIs: canApplyMessages.is } : {}),
        ...(canApplyMessages?.en ? { messageEn: canApplyMessages.en } : {}),
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
    errorCode?: string,
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
      case 'PERSON_NOT_REGISTERED_IN_ICELAND':
        return RequirementKey.localResidency
      default:
        // Must be an object: a bare string second arg is treated as winston
        // splat and silently dropped, which is why ~265 of these warnings a
        // month never recorded which code was unhandled.
        this.logger.warn(`${LOGTAG} unhandled can apply error code`, {
          errorCode,
        })

        return RequirementKey.deniedByService
    }
  }

  /**
   * Resolve RLS's own human-readable descriptions (both languages) for an error
   * code, from the cached error-code catalogue. Returns null for an unknown
   * code. The caller attaches both and the frontend picks by locale. Best-effort
   * — never throws. Used by the eligibility resolver here and by the submission
   * template-api-module, which injects this service.
   */
  async describeErrorCode(
    code: string,
  ): Promise<{ is: string | null; en: string | null } | null> {
    try {
      const descriptions =
        await this.drivingLicenseApi.getErrorCodeDescriptions()
      const match = descriptions.find((d) => d.code === code)
      if (!match) {
        // RLS has no description for this code either, so the UI falls back to
        // generic copy. Worth knowing about: it means neither we nor RLS
        // document the code, and it is a candidate to ask RLS to catalogue.
        this.logger.warn(`${LOGTAG} no RLS description for error code`, {
          code,
        })
        return null
      }
      return {
        is: match.descriptionIs ?? null,
        en: match.descriptionEn ?? null,
      }
    } catch (e) {
      // Best-effort fallback copy: a codetable outage must never fail the
      // caller (e.g. the whole eligibility query). Log and fall through so the
      // curated/generic message still renders.
      this.logger.warn(
        `${LOGTAG} failed to resolve RLS error-code description`,
        e,
      )
      return null
    }
  }

  async canApplyFor(
    type: 'B-full' | 'B-temp' | 'BE' | 'B-full-renewal-65',
    auth: Auth,
  ) {
    if (type === 'B-full-renewal-65') {
      return this.drivingLicenseApi.getCanApplyForRenewal65({
        auth,
      })
    } else if (type === 'B-full') {
      return this.drivingLicenseApi.getCanApplyForCategoryFull({
        category: 'B',
        auth,
      })
    } else if (type === 'BE') {
      return this.drivingLicenseApi.getCanApplyForCategoryFull({
        category: 'BE',
        auth,
      })
    } else if (type === 'B-temp') {
      return this.drivingLicenseApi.getCanApplyForCategoryTemporary({
        auth,
      })
    } else {
      throw new Error('unhandled license type')
    }
  }

  async studentCanGetPracticePermit(params: {
    studentSSN: string
    auth: Auth
  }) {
    const { studentSSN, auth } = params
    return await this.drivingLicenseApi.postCanApplyForPracticePermit({
      studentSSN,
      auth,
    })
  }

  async canGetNewDuplicate(
    auth: Auth,
  ): Promise<DrivinglicenseDuplicateValidityStatus> {
    const license = await this.drivingLicenseApi.getCurrentLicense({
      auth,
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
    auth: Auth
    stolenOrLost: boolean
    pickUpLicense: boolean
    imageBiometricsId: string | null
    signatureBiometricsId: string | null
  }): Promise<number> {
    const {
      districtId,
      auth,
      stolenOrLost,
      pickUpLicense,
      imageBiometricsId,
      signatureBiometricsId,
    } = params
    return await this.drivingLicenseApi.postApplicationNewCollaborative({
      districtId,
      stolenOrLost,
      auth,
      pickUpLicense,
      imageBiometricsId,
      signatureBiometricsId,
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
    auth: Auth,
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
        photoBiometricsId: input.photoBiometricsId,
        signatureBiometricsId: input.signatureBiometricsId,
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
      photoBiometricsId: input.photoBiometricsId,
      signatureBiometricsId: input.signatureBiometricsId,
    })

    return {
      success: response,
      errorMessage: null,
    }
  }

  async applyForRenewal65(
    auth: Auth,
    input: NewRenewal65DrivingLicenseInput,
  ): Promise<NewDrivingLicenseResult> {
    const response = await this.drivingLicenseApi.postApplyForRenewal65({
      auth,
      districtId: input.jurisdiction,
      phoneNumber: input.primaryPhoneNumber,
      email: input.studentEmail,
      pickupPlasticAtDistrict: input.pickupPlasticAtDistrict,
      sendPlasticToPerson: input.sendPlasticToPerson,
      contentList: input.contentList,
      photoBiometricsId: input.photoBiometricsId,
      signatureBiometricsId: input.signatureBiometricsId,
    })

    return {
      success: response.success,
      errorMessage: null,
      applicationGuid: response.applicationGuid,
    }
  }

  // Legacy 65+ submit, used when `is65RenewalRedesignEnabled` flag is OFF.
  // Removed alongside `postRenewLicenseOver65` in the wrapper once the flag
  // has been ON in prod long enough to retire the legacy submit path.
  async renewDrivingLicense65AndOver(
    auth: User['authorization'],
    input: { jurisdiction: number } & Pick<
      NewRenewal65DrivingLicenseInput,
      'pickupPlasticAtDistrict' | 'sendPlasticToPerson'
    >,
  ): Promise<NewDrivingLicenseResult> {
    const response = await this.drivingLicenseApi.postRenewLicenseOver65({
      token: auth,
      districtId: input.jurisdiction,
      pickupPlasticAtDistrict: input.pickupPlasticAtDistrict,
      sendPlasticToPerson: input.sendPlasticToPerson,
    })

    return {
      success: response.isOk ?? false,
      errorMessage: response.errorCode ?? null,
    }
  }

  async applyForBELicense(
    nationalId: User['nationalId'],
    auth: Auth,
    input: NewBEDrivingLicenseInput,
  ): Promise<NewDrivingLicenseResult> {
    const response = await this.drivingLicenseApi.postApplyForBELicense({
      nationalIdApplicant: nationalId,
      auth,
      jurisdictionId: input.jurisdiction,
      instructorSSN: input.instructorSSN,
      email: input.studentEmail,
      phoneNumber: input.primaryPhoneNumber,
      contentList: input.contentList,
      photoBiometricsId: input.photoBiometricsId,
      signatureBiometricsId: input.signatureBiometricsId,
      sendPlasticToPerson: input.sendPlasticToPerson,
      healthDeclarationModel: input.healthDeclarationModel,
    })

    return {
      success: response.success,
      errorMessage: null,
      applicationGuid: response.applicationGuid,
    }
  }

  /**
   * B-full via the v6 `withhealthdeclaration` endpoint. Takes the whole `Auth`
   * object, not `auth.authorization` — the v6 client wraps the call in
   * `withAuthContext`, which needs the object to put the token on the `jwttoken`
   * header. Passing the string would leave that header unset and every request
   * would come back 400, while unit tests carried on passing.
   *
   * Every method here now takes `Auth` except `renewDrivingLicense65AndOver`,
   * which still calls the v5 endpoint and so still takes the bare token.
   */
  async newDrivingLicenseWithHealthDeclaration(
    auth: Auth,
    input: NewDrivingLicenseWithHealthDeclarationInput,
  ): Promise<NewDrivingLicenseResult> {
    const applicationGuid =
      await this.drivingLicenseApi.postFullLicenseWithHealthDeclarationV6({
        auth,
        category: input.licenseCategory,
        model: {
          districtId: input.districtId,
          sendPlasticToPerson: input.sendPlasticToPerson,
          email: input.email,
          primaryPhoneNumber: input.primaryPhoneNumber,
          healthDeclaration: input.healthDeclaration,
          contentList: input.contentList,
          photoBiometricsId: input.photoBiometricsId,
          signatureBiometricsId: input.signatureBiometricsId,
        },
      })

    // Return the RLS application guid so the submission service can log it next
    // to our own application id — together they are the reconciliation record.
    return {
      success: true,
      errorMessage: null,
      applicationGuid,
    }
  }

  /**
   * B-temp counterpart. Unlike the full-licence endpoint this one returns a DTO
   * rather than a boolean, so the result MUST be mapped: this single call now
   * decides success on its own, where previously the legacy submit that followed
   * did. Leaving the DTO unread would make `submitApplication` never see
   * `success: false`, and every RLS business rejection would reach the applicant
   * as "submitted".
   */
  async newTemporaryDrivingLicenseWithHealthDeclaration(
    auth: Auth,
    input: NewTemporaryDrivingLicenseWithHealthDeclarationInput,
  ): Promise<NewDrivingLicenseResult> {
    const applicationGuid =
      await this.drivingLicenseApi.postTemporaryLicenseWithHealthDeclarationV6({
        auth,
        model: {
          districtId: input.districtId,
          instructorSSN: input.instructorSSN,
          sendPlasticToPerson: input.sendPlasticToPerson,
          email: input.email,
          primaryPhoneNumber: input.primaryPhoneNumber,
          healthDeclaration: input.healthDeclaration,
          contentList: input.contentList,
          photoBiometricsId: input.photoBiometricsId,
          signatureBiometricsId: input.signatureBiometricsId,
        },
      })

    // Reaching here means RLS returned 2xx — enhanced fetch throws on 4xx, which
    // is how this endpoint signals a business rejection (e.g. 400
    // APPLICATION_ALREADY_EXISTS). Do NOT gate on the DTO `result` field: RLS
    // returns the new application's guid in the body on success, and dev showed a
    // successfully-created application come back with `result` falsy, which then
    // surfaced to the applicant as a failed submission *after they had paid*.
    // The client's `postTemporaryLicenseWithHealthDeclarationV6` already maps the
    // one benign 400 (a lost-response retry) to a resolved value, so a throw here
    // is a genuine failure and must propagate to `submitApplication`. The value
    // is the RLS application guid (or null on the lost-response path); return it
    // so the submission service can log it next to our own application id.
    return {
      success: true,
      errorMessage: null,
      applicationGuid,
    }
  }

  async getQualityPhotoUri(auth: Auth): Promise<string | null> {
    const image = await this.drivingLicenseApi.getQualityPhoto({
      auth,
    })
    const qualityPhoto = image?.data?.length
      ? `data:image/jpeg;base64,${image?.data.substr(1, image.data.length - 2)}`
      : null

    return qualityPhoto
  }

  async getQualityPhoto(auth: Auth): Promise<QualityPhotoResult> {
    const hasQualityPhoto = await this.drivingLicenseApi.getHasQualityPhoto({
      auth,
    })

    return {
      hasQualityPhoto,
    }
  }

  async getQualitySignatureUri(auth: Auth): Promise<string | null> {
    const image = await this.drivingLicenseApi.getQualitySignature({
      auth,
    })
    const qualitySignature = image?.data?.length
      ? `data:image/jpeg;base64,${image?.data.substr(1, image.data.length - 2)}`
      : null

    return qualitySignature
  }

  async getQualitySignature(auth: Auth): Promise<QualitySignatureResult> {
    const hasQualitySignature =
      await this.drivingLicenseApi.getHasQualitySignature({
        auth,
      })

    return {
      hasQualitySignature,
    }
  }

  async getDrivingAssessment(auth: Auth): Promise<StudentAssessment | null> {
    const assessment = await this.drivingLicenseApi.getDrivingAssessment({
      auth,
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

  // Legacy B-temp health-declaration submit, still on v5: it is the flag-OFF
  // path, and flags are frozen into application answers, so in-flight drafts
  // keep using it. Dies with `isBTempRedesignEnabled`, alongside the v5
  // wrapper method it calls.
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

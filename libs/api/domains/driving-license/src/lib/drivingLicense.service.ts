import { Inject, Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  TeachingRightsStatus,
  StudentInformation,
  Juristiction,
  NewDrivingLicenseInput,
  NewDrivingLicenseResult,
  NewDrivingAssessmentResult,
  RequirementKey,
  ApplicationEligibility,
  DrivingLicenseCategory,
  QualityPhotoResult,
  DrivingLicenseApplicationType,
  NewTemporaryDrivingLicenseInput,
  ApplicationEligibilityRequirement,
} from './drivingLicense.type'
import {
  CanApplyErrorCodeBFull,
  CanApplyErrorCodeBTemporary,
  DriversLicense,
  DrivingAssessment,
  DrivingLicenseApi,
  Teacher,
} from '@island.is/clients/driving-license'
import {
  BLACKLISTED_JURISTICTION,
  DRIVING_ASSESSMENT_MAX_AGE,
} from './util/constants'
import sortTeachers from './util/sortTeachers'
import { StudentAssessment } from '..'
import { FetchError } from '@island.is/clients/middlewares'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import { hasResidenceHistory } from './util/hasResidenceHistory'

const LOGTAG = '[api-domains-driving-license]'

@Injectable()
export class DrivingLicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly drivingLicenseApi: DrivingLicenseApi,
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}

  async getDrivingLicense(
    nationalId: User['nationalId'],
  ): Promise<DriversLicense | null> {
    try {
      return await this.drivingLicenseApi.getCurrentLicense({
        nationalId,
      })
    } catch (e) {
      return this.handleGetLicenseError(e)
    }
  }

  private handleGetLicenseError(e: unknown) {
    // The goal of this is to basically normalize the known semi-error responses
    // so both those who are not found and those who have invalid/expired licenses will return nothing
    if (e instanceof Error && e.name === 'FetchError') {
      const err = (e as unknown) as FetchError

      if ([400, 404].includes(err.status)) {
        return null
      }
    }

    throw e
  }

  async getStudentInformation(
    nationalId: string,
  ): Promise<StudentInformation | null> {
    let licenses
    try {
      licenses = await this.drivingLicenseApi.getAllLicenses({ nationalId })
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

  async getTeachers(): Promise<Teacher[]> {
    const teachers = await this.drivingLicenseApi.getTeachers()

    return teachers.sort(sortTeachers)
  }

  async getTeachingRights(
    nationalId: User['nationalId'],
  ): Promise<TeachingRightsStatus> {
    const hasTeachingRights = await this.drivingLicenseApi.getIsTeacher({
      nationalId,
    })

    return {
      nationalId,
      hasTeachingRights,
    }
  }

  async getListOfJuristictions(): Promise<Juristiction[]> {
    const embaetti = await this.drivingLicenseApi.getListOfJuristictions()

    return embaetti.filter(({ id }) => id !== BLACKLISTED_JURISTICTION)
  }

  async getDrivingAssessmentResult(
    nationalId: string,
  ): Promise<DrivingAssessment | null> {
    try {
      return await this.drivingLicenseApi.getDrivingAssessment({
        nationalId,
      })
    } catch (e) {
      if ((e as { status: number })?.status === 404) {
        return null
      }

      throw e
    }
  }

  async getApplicationEligibility(
    user: User,
    nationalId: string,
    type: DrivingLicenseApplicationType,
  ): Promise<ApplicationEligibility> {
    const assessmentResult = await this.getDrivingAssessmentResult(nationalId)
    const hasFinishedSchool = await this.drivingLicenseApi.getHasFinishedOkugerdi(
      {
        nationalId,
      },
    )

    const residenceHistory = await this.nationalRegistryXRoadService.getNationalRegistryResidenceHistory(
      user,
      nationalId,
    )
    const localRecidency = hasResidenceHistory(residenceHistory)

    const canApply = await this.canApplyFor(nationalId, type)

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
          ]
        : []),
      ...(type === 'B-temp'
        ? [
            {
              key: RequirementKey.localResidency,
              requirementMet: localRecidency,
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

  async canApplyFor(nationalId: string, type: 'B-full' | 'B-temp') {
    if (type === 'B-full') {
      return this.drivingLicenseApi.getCanApplyForCategoryFull({
        nationalId,
        category: 'B',
      })
    } else if (type === 'B-temp') {
      return this.drivingLicenseApi.getCanApplyForCategoryTemporary({
        nationalId,
      })
    } else {
      throw new Error('unhandled license type')
    }
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
    input: NewTemporaryDrivingLicenseInput,
  ): Promise<NewDrivingLicenseResult> {
    const success = await this.drivingLicenseApi.postCreateDrivingLicenseTemporary(
      {
        willBringHealthCertificate: input.needsToPresentHealthCertificate,
        willBringQualityPhoto: input.needsToPresentQualityPhoto,
        juristictionId: input.juristictionId,
        nationalIdTeacher: input.teacherNationalId,
        nationalIdApplicant: nationalId,
        sendLicenseInMail: false,
        email: input.email,
        phone: input.phone,
      },
    )

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
      category: DrivingLicenseCategory.B,
      juristictionId: input.juristictionId,
      willBringHealthCertificate: input.needsToPresentHealthCertificate,
      nationalIdApplicant: nationalId,
      willBringQualityPhoto: input.needsToPresentQualityPhoto,
      sendLicenseInMail: false,
      sendLicenseToAddress: '',
    })

    return {
      success: response,
      errorMessage: null,
    }
  }

  async getQualityPhotoUri(
    nationalId: User['nationalId'],
  ): Promise<string | null> {
    const image = await this.drivingLicenseApi.getQualityPhoto({
      nationalId,
    })
    const qualityPhoto =
      image?.data && image?.data.length > 0
        ? `data:image/jpeg;base64,${image?.data.substr(
            1,
            image.data.length - 2,
          )}`
        : null

    return qualityPhoto
  }

  async getQualityPhoto(
    nationalId: User['nationalId'],
  ): Promise<QualityPhotoResult> {
    const hasQualityPhoto = await this.drivingLicenseApi.getHasQualityPhoto({
      nationalId,
    })

    return {
      hasQualityPhoto,
    }
  }

  async getDrivingAssessment(
    nationalId: string,
  ): Promise<StudentAssessment | null> {
    const assessment = await this.drivingLicenseApi.getDrivingAssessment({
      nationalId,
    })

    if (!assessment) {
      return null
    }

    let teacherName: string | null
    if (assessment.nationalIdTeacher) {
      const teacherLicense = await this.getDrivingLicense(
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
}

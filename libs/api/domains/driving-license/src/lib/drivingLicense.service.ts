import { Injectable } from '@nestjs/common'
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
} from './drivingLicense.type'
import {
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

@Injectable()
export class DrivingLicenseService {
  constructor(private readonly drivingLicenseApi: DrivingLicenseApi) {}

  getDrivingLicense(
    nationalId: User['nationalId'],
  ): Promise<DriversLicense | null> {
    return this.drivingLicenseApi.getCurrentLicense({ nationalId })
  }

  async getStudentInformation(
    nationalId: string,
  ): Promise<StudentInformation | null> {
    const drivingLicense = await this.drivingLicenseApi.getCurrentLicense({
      nationalId,
    })

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
    nationalId: string,
    type: DrivingLicenseApplicationType,
  ): Promise<ApplicationEligibility> {
    const assessmentResult = await this.getDrivingAssessmentResult(nationalId)
    const hasFinishedSchool = await this.drivingLicenseApi.getHasFinishedOkugerdi(
      {
        nationalId,
      },
    )

    const canApply = await this.canApplyFor(nationalId, type)

    const requirements = []

    if (type === 'B-full') {
      requirements.push(
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
      )
    } else if (type === 'B-temp') {
      requirements.push({
        key: RequirementKey.localResidency,
        requirementMet: true,
      })
    } else {
      throw new Error('unknown type')
    }

    requirements.push({
      key: RequirementKey.deniedByService,
      requirementMet: canApply,
    })

    // only eligible if we dont find an unmet requirement
    const isEligible = !requirements.find(
      ({ requirementMet }) => requirementMet === false,
    )

    return {
      requirements,
      isEligible,
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

  async getQualityPhoto(
    nationalId: User['nationalId'],
  ): Promise<QualityPhotoResult> {
    const hasQualityPhoto = await this.drivingLicenseApi.getHasQualityPhoto({
      nationalId,
    })
    const image = hasQualityPhoto
      ? await this.drivingLicenseApi.getQualityPhoto({
          nationalId,
        })
      : null

    return {
      success: hasQualityPhoto,
      qualityPhoto: image?.data ?? null,
      errorMessage: null,
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

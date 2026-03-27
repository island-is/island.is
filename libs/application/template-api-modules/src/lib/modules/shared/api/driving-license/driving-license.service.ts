import { Injectable } from '@nestjs/common'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { coreErrorMessages } from '@island.is/application/core'

import { StudentAssessment, DrivingLicense, HasQualitySignature } from './types'
import {
  DrivingLicenseBookService,
  Organization as DrivingLicenseBookSchool,
} from '@island.is/api/domains/driving-license-book'
import {
  DrivingLicenseApi,
  Jurisdiction,
  TeacherV4,
} from '@island.is/clients/driving-license'
import sortTeachers from './sortTeachers'
import { TemplateApiModuleActionProps } from '../../../../types'
import { CurrentLicenseParameters } from '@island.is/application/types'
import {
  getFakeData,
  buildFakeCurrentLicense,
  buildFakeQualityPhoto,
  buildFakeQualitySignature,
  buildFakeQualityPhotoAndSignature,
  buildFakeAllPhotosFromThjodskra,
  buildFakeDrivingAssessment,
} from './drivingLicenseFakeData'

@Injectable()
export class DrivingLicenseProviderService extends BaseTemplateApiService {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseApi,
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {
    super('DrivingLicenseShared')
  }

  private async hasTeachingRights(token: string): Promise<boolean> {
    return await this.drivingLicenseService.getIsTeacher({ token })
  }

  async getHasTeachingRights({
    auth,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    const teachingRights = await this.hasTeachingRights(auth.authorization)
    if (teachingRights) {
      return true
    } else {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.drivingLicenseNoTeachingRightsTitle,
          summary: coreErrorMessages.drivingLicenseNoTeachingRightsSummary,
        },
        400,
      )
    }
  }

  async getTeacherRights({ auth }: TemplateApiModuleActionProps) {
    const teachingRights = await this.drivingLicenseBookService.getTeacher(
      auth.nationalId,
    )
    if (teachingRights.rights) {
      return teachingRights
    } else {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.drivingLicenseNoTeachingRightsTitle,
          summary: coreErrorMessages.drivingLicenseNoTeachingRightsSummary,
        },
        400,
      )
    }
  }

  async getisEmployee({
    auth,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    const isEmployee = await this.drivingLicenseBookService.isSchoolStaff(auth)
    if (isEmployee) {
      return isEmployee
    } else {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.drivingLicenseNotEmployeeTitle,
          summary: coreErrorMessages.drivingLicenseNotEmployeeSummary,
        },
        400,
      )
    }
  }

  async drivingSchoolForEmployee({
    auth,
  }: TemplateApiModuleActionProps): Promise<DrivingLicenseBookSchool> {
    return this.drivingLicenseBookService
      .isSchoolStaff(auth)
      .then((isEmployee) => {
        if (isEmployee) {
          return this.drivingLicenseBookService.getSchoolForSchoolStaff(auth)
        } else {
          throw new TemplateApiError(
            {
              title: coreErrorMessages.drivingLicenseNotEmployeeTitle,
              summary: coreErrorMessages.drivingLicenseNotEmployeeSummary,
            },
            400,
          )
        }
      })
      .catch(() => {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.drivingLicenseNotEmployeeTitle,
            summary: coreErrorMessages.drivingLicenseNotEmployeeSummary,
          },
          400,
        )
      })
  }

  async teachers(): Promise<TeacherV4[]> {
    const teachers = await this.drivingLicenseService.getTeachersV4()
    if (teachers) {
      return teachers.sort(sortTeachers)
    } else {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }
  }

  async currentLicense({
    auth,
    application,
    params,
  }: TemplateApiModuleActionProps<CurrentLicenseParameters>): Promise<DrivingLicense> {
    let drivingLicense

    const fakeData = getFakeData(application.answers)
    if (fakeData) {
      drivingLicense = buildFakeCurrentLicense(fakeData)
    } else {
      if (params?.useLegacyVersion) {
        drivingLicense =
          await this.drivingLicenseService.legacyGetCurrentLicense({
            nationalId: auth.nationalId,
            token: auth.authorization,
          })
      } else {
        drivingLicense = await this.drivingLicenseService.getCurrentLicense({
          token: auth.authorization,
        })
      }
    }

    const categoryB = (drivingLicense?.categories ?? []).find(
      (cat) => cat.name === 'B' || cat.nr === 'B',
    )

    // Validate that user has the necessary categories
    const today = new Date()
    if (
      params?.validCategories &&
      (!drivingLicense?.categories ||
        !drivingLicense.categories.some(
          (x) =>
            (!x.expires || x.expires >= today) &&
            params.validCategories?.includes(
              (params?.useLegacyVersion ? x.name : x.nr) || '',
            ),
        ))
    ) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.drivingLicenseMissingValidCategory,
          summary: coreErrorMessages.drivingLicenseMissingValidCategory,
        },
        400,
      )
    }

    return {
      currentLicense: categoryB ? categoryB.nr || categoryB.name : null,
      remarks: drivingLicense?.remarks ?? [],
      categories: drivingLicense?.categories,
      id: drivingLicense?.id,
      birthCountry: drivingLicense?.birthCountry,
      issued: drivingLicense?.issued,
      expires: drivingLicense?.expires,
      publishPlaceName: drivingLicense?.publishPlaceName,
    }
  }

  async qualityPhoto({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<{
    hasQualityPhoto: boolean
    qualityPhoto: string | null
  }> {
    const fakeData = getFakeData(application.answers)
    if (fakeData) {
      return buildFakeQualityPhoto(fakeData)
    }

    const hasQualityPhoto = await this.drivingLicenseService.getHasQualityPhoto(
      { token: auth.authorization },
    )

    const qualityPhoto = await this.drivingLicenseService.getQualityPhoto({
      token: auth.authorization,
    })

    return {
      hasQualityPhoto,
      qualityPhoto: qualityPhoto?.data || null,
    }
  }

  async qualitySignature({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<HasQualitySignature | null> {
    const fakeData = getFakeData(application.answers)
    if (fakeData) {
      return buildFakeQualitySignature(fakeData)
    }

    const hasQualitySignature =
      await this.drivingLicenseService.getHasQualitySignature({
        token: auth.authorization,
      })
    return {
      hasQualitySignature,
    }
  }

  async qualityPhotoAndSignature({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const fakeData = getFakeData(application.answers)
    if (fakeData) {
      return buildFakeQualityPhotoAndSignature(fakeData)
    }

    try {
      return await this.drivingLicenseService.getQualityPhotoAndSignature({
        token: auth.authorization,
      })
    } catch {
      return null
    }
  }

  async allPhotosFromThjodskra({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const fakeData = getFakeData(application.answers)
    if (fakeData) {
      return buildFakeAllPhotosFromThjodskra(fakeData)
    }

    try {
      return await this.drivingLicenseService.getAllPhotosFromThjodskra({
        token: auth.authorization,
      })
    } catch (error) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }
  }

  async jurisdictions(): Promise<Jurisdiction[]> {
    return await this.drivingLicenseService.getListOfJurisdictions()
  }

  private async getDrivingAssessment(
    token: string,
  ): Promise<StudentAssessment | null> {
    const assessment = await this.drivingLicenseService.getDrivingAssessment({
      token,
    })

    if (!assessment) {
      return null
    }

    let teacherName: string | null
    if (assessment.nationalIdTeacher) {
      const teacherLicense =
        await this.drivingLicenseService.legacyGetCurrentLicense({
          nationalId: assessment.nationalIdTeacher,
        })
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

  async drivingAssessment({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<StudentAssessment | null> {
    const fakeData = getFakeData(application.answers)
    if (fakeData) {
      return buildFakeDrivingAssessment()
    }

    return await this.getDrivingAssessment(auth.authorization)
  }
}

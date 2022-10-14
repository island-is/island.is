import { Injectable } from '@nestjs/common'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import {
  StudentAssessment,
  Teacher,
  DrivingLicenseBookSchool,
} from '@island.is/api/schema'
import {
  DrivingLicenseFakeData,
  HasQualityPhoto,
  YES,
  DrivingLicense,
} from './types'
import { TemplateApiModuleActionProps } from '@island.is/application/template-api-modules'
import { DrivingLicenseBookService } from '@island.is/api/domains/driving-license-book'
import {
  DrivingLicenseApi,
  Juristiction,
} from '@island.is/clients/driving-license'
import sortTeachers from './sortTeachers'

@Injectable()
export class DrivingLicenseProviderService extends BaseTemplateApiService {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseApi,
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {
    super('DrivingLicenseShared')
  }

  private async hasTeachingRights(nationalId: string): Promise<Boolean> {
    return await this.drivingLicenseService.getIsTeacher({ nationalId })
  }

  async getHasTeachingRights({
    auth,
  }: TemplateApiModuleActionProps): Promise<Boolean> {
    const teachingRights = await this.hasTeachingRights(auth.nationalId)
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

  async getisEmployee({
    auth,
  }: TemplateApiModuleActionProps): Promise<Boolean> {
    return await this.drivingLicenseBookService.isSchoolStaff(auth)
  }

  async drivingSchoolForEmployee({
    auth,
  }: TemplateApiModuleActionProps): Promise<DrivingLicenseBookSchool> {
    const school = await this.hasTeachingRights(auth.nationalId)
    if (school) {
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
  }

  async teachers(): Promise<Teacher[]> {
    const teachers = await this.drivingLicenseService.getTeachers()
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
  }: TemplateApiModuleActionProps): Promise<DrivingLicense> {
    const fakeData = getValueViaPath<DrivingLicenseFakeData>(
      application.answers,
      'fakeData',
    )
    if (fakeData?.useFakeData === YES) {
      return {
        currentLicense: fakeData.currentLicense === 'temp' ? 'B' : null,
        healthRemarks:
          fakeData.healthRemarks === YES
            ? ['Gervilimur eða gervilimir/stoðtæki fyrir fætur og hendur.']
            : undefined,
      }
    }
    const drivingLicense = await this.drivingLicenseService.getCurrentLicense({
      nationalId: auth.nationalId,
    })
    const categoryB = (drivingLicense?.categories ?? []).find(
      (cat) => cat.name === 'B',
    )
    return {
      currentLicense: categoryB ? categoryB.name : null,
      healthRemarks: drivingLicense?.healthRemarks,
    }
  }

  async qualityPhoto({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<HasQualityPhoto> {
    // If running locally or on dev allow for fake data
    const useFakeData = getValueViaPath<'yes' | 'no'>(
      application.answers,
      'fakeData.useFakeData',
    )

    if (useFakeData === 'yes') {
      const hasQualityPhoto = getValueViaPath<'yes' | 'no'>(
        application.answers,
        'fakeData.qualityPhoto',
      )
      return { hasQualityPhoto: hasQualityPhoto === 'yes' }
    }
    const hasQualityPhoto = await this.drivingLicenseService.getHasQualityPhoto(
      { nationalId: auth.nationalId },
    )
    return {
      hasQualityPhoto,
    }
  }

  async juristictions(): Promise<Juristiction[]> {
    return await this.drivingLicenseService.getListOfJuristictions()
  }

  private async getDrivingAssessment(
    nationalId: string,
  ): Promise<StudentAssessment | null> {
    const assessment = await this.drivingLicenseService.getDrivingAssessment({
      nationalId,
    })

    if (!assessment) {
      return null
    }

    let teacherName: string | null
    if (assessment.nationalIdTeacher) {
      const teacherLicense = await this.drivingLicenseService.getCurrentLicense(
        {
          nationalId: assessment.nationalIdTeacher,
        },
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

  async drivingAssessment({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<StudentAssessment | null> {
    const fakeData = application.answers.fakeData as
      | DrivingLicenseFakeData
      | undefined

    if (fakeData?.useFakeData === YES) {
      return {
        teacherNationalId: '123456-7890',
        teacherName: 'Bílar Kennar Ekilsson',
        studentNationalId: '123456-7890',
      }
    }

    return await this.getDrivingAssessment(auth.nationalId)
  }
}

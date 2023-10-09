import { Injectable } from '@nestjs/common'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'

import {
  StudentAssessment,
  DrivingLicenseFakeData,
  HasQualityPhoto,
  YES,
  DrivingLicense,
  HasQualitySignature,
} from './types'
import {
  DrivingLicenseBookService,
  Organization as DrivingLicenseBookSchool,
} from '@island.is/api/domains/driving-license-book'
import {
  DrivingLicenseApi,
  Jurisdiction,
  QualitySignature,
  Teacher,
} from '@island.is/clients/driving-license'
import sortTeachers from './sortTeachers'
import { TemplateApiModuleActionProps } from '../../../../types'
import { CurrentLicenseParameters } from '@island.is/application/types'

@Injectable()
export class DrivingLicenseProviderService extends BaseTemplateApiService {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseApi,
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {
    super('DrivingLicenseShared')
  }

  private async hasTeachingRights(nationalId: string): Promise<boolean> {
    return await this.drivingLicenseService.getIsTeacher({ nationalId })
  }

  async getHasTeachingRights({
    auth,
  }: TemplateApiModuleActionProps): Promise<boolean> {
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
    params,
  }: TemplateApiModuleActionProps<CurrentLicenseParameters>): Promise<DrivingLicense> {
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

    let drivingLicense
    if (params?.useLegacyVersion) {
      drivingLicense = await this.drivingLicenseService.legacyGetCurrentLicense(
        {
          nationalId: auth.nationalId,
          token: auth.authorization,
        },
      )
    } else {
      drivingLicense = await this.drivingLicenseService.getCurrentLicense({
        token: auth.authorization,
      })
    }

    const categoryB = (drivingLicense?.categories ?? []).find(
      (cat) => cat.name === 'B' || cat.nr === 'B',
    )

    // Validate that user has the necessary categories
    if (
      params?.validCategories &&
      (!drivingLicense?.categories ||
        !drivingLicense.categories.some((x) =>
          params.validCategories?.includes(
            params?.useLegacyVersion ? x.name : x.nr || '',
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
      currentLicense: categoryB ? categoryB.name : null,
      healthRemarks: drivingLicense?.healthRemarks,
      categories: drivingLicense?.categories,
      id: drivingLicense?.id,
      birthCountry: drivingLicense?.birthCountry,
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

  async qualitySignature({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<HasQualitySignature | null> {
    // If running locally or on dev allow for fake data
    const useFakeData = getValueViaPath<'yes' | 'no'>(
      application.answers,
      'fakeData.useFakeData',
    )

    if (useFakeData === 'yes') {
      const hasQualitySignature = getValueViaPath<'yes' | 'no'>(
        application.answers,
        'fakeData.qualitySignature',
      )
      if (hasQualitySignature === 'yes') {
        return {
          hasQualitySignature: true,
        }
      } else {
        return null
      }
    }
    const hasQualitySignature =
      await this.drivingLicenseService.getHasQualitySignature({
        nationalId: auth.nationalId,
      })
    return {
      hasQualitySignature,
    }
  }

  async jurisdictions(): Promise<Jurisdiction[]> {
    return await this.drivingLicenseService.getListOfJurisdictions()
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

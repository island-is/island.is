import { Injectable } from '@nestjs/common'

import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import {
  DrivingLicenseService,
  TeachingRightsStatus,
  Juristiction,
} from '@island.is/api/domains/driving-license'
import {
  StudentAssessment,
  Teacher,
  DrivingLicenseBookSchool,
} from '@island.is/api/schema'
import { FetchError } from '@island.is/clients/middlewares'
import { DrivingLicenseFakeData, HasQualityPhoto, YES } from './types'
import { TemplateApiModuleActionProps } from '@island.is/application/template-api-modules'
import { CurrentLicenseProviderResult } from '../../../../../../../templates/driving-license/src/dataProviders/CurrentLicenseProvider'
import { DrivingLicenseBookService } from '@island.is/api/domains/driving-license-book'

@Injectable()
export class DrivingLicenseProviderService extends BaseTemplateApiService {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {
    super('DrivingLicenseShared')
  }

  private async hasTeachingRights(nationalId: string): Promise<Boolean> {
    const data = await this.drivingLicenseService.getTeachingRights(nationalId)
    return data.hasTeachingRights
  }

  private handleError(e: unknown) {
    if (e instanceof Error && e.name === 'FetchError') {
      const err = (e as unknown) as FetchError
      throw new TemplateApiError(
        {
          title:
            err.problem?.title || coreErrorMessages.failedDataProviderSubmit,
          summary: err.problem?.detail || '',
        },
        400,
      )
    }

    throw e
  }

  // Teaching Rights
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

  // Teachers
  async teachers(): Promise<Teacher[]> {
    const teachers = await this.drivingLicenseService.getTeachers()
    if (teachers) {
      return teachers
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

  // Current License
  async currentLicense({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<CurrentLicenseProviderResult> {
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
    const drivingLicense = await this.drivingLicenseService.getDrivingLicense(
      auth.nationalId,
    )
    const categoryB = (drivingLicense?.categories ?? []).find(
      (cat) => cat.name === 'B',
    )
    return {
      currentLicense: categoryB ? categoryB.name : null,
      healthRemarks: drivingLicense?.healthRemarks,
    }
  }

  // Quality Photo

  async qualityPhoto({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<HasQualityPhoto> {
    // If running locally or on dev allow for fake data
    const useFakeData = getValueViaPath<'yes' | 'no'>(
      application.answers,
      'fakeData.useFakeData',
    )
    // To use fake data for the quality photo provider take a look at the implementation in libs/application/templates/driving-license/src/forms/application.ts
    if (useFakeData === 'yes') {
      const hasQualityPhoto = getValueViaPath<'yes' | 'no'>(
        application.answers,
        'fakeData.qualityPhoto',
      )
      return { hasQualityPhoto: hasQualityPhoto === 'yes' }
    }
    return await this.drivingLicenseService.getQualityPhoto(auth.nationalId)
  }

  // Has Quality Signature
  // TODO: Application that will use this function is still in the works so this is just prepp work

  // async hasQualitySignature({
  //   auth,
  //   application,
  // }: TemplateApiModuleActionProps): Promise<HasQualitySignature> {
  //   // If running locally or on dev allow for fake data
  //   const useFakeData = getValueViaPath<'yes' | 'no'>(
  //     application.answers,
  //     'fakeData.useFakeData',
  //   )
  //   // To use fake data for the quality Signature provider take a look at the implementation in libs/application/templates/driving-license/src/forms/application.ts
  //   if (useFakeData === 'yes') {
  //     const hasQualitySignature = getValueViaPath<'yes' | 'no'>(
  //       application.answers,
  //       'fakeData.qualitySignature',
  //     )
  //     return{ hasQualitySignature: hasQualitySignature === 'yes'}
  //   }
  //  return await this.drivingLicenseService.getQualitySignature(auth.nationalId)
  // }

  // Juristiction
  async juristictions(): Promise<Juristiction[]> {
    return await this.drivingLicenseService.getListOfJuristictions()
  }

  // Driving Assesment
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

    return await this.drivingLicenseService.getDrivingAssessment(
      auth.nationalId,
    )
  }
}

import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { DrivingLicenseBookService } from '@island.is/api/domains/driving-license-book'
import { DrivingSchool } from './types'
import { getValueViaPath } from '@island.is/application/core'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

@Injectable()
export class DrivingSchoolConfirmationService extends BaseTemplateApiService {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {
    super(ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION)
  }

  async submitApplication({
    application: { answers, externalData },
    auth,
  }: TemplateApiModuleActionProps) {
    // TODO: Confirmation email
    const studentBookId = getValueViaPath<string>(answers, 'studentBookId')
    const confirmation = getValueViaPath<{ date: string; school: string }>(
      answers,
      'confirmation',
    )
    if (!confirmation || !studentBookId) {
      throw new Error(`Missing date and school`)
    }
    const schoolNationalId = (
      externalData.drivingSchoolForEmployee.data as DrivingSchool
    ).nationalId

    try {
      const result =
        await this.drivingLicenseBookService.createDrivingSchoolTestResult({
          bookId: studentBookId,
          schoolTypeId: parseInt(confirmation?.school),
          schoolNationalId: schoolNationalId,
          schoolEmployeeNationalId: auth.nationalId,
          createdOn: confirmation?.date,
          comments: '',
        })

      if (!result) {
        throw new Error(`Application submission failed`)
      }

      return { success: true, id: result.id }
    } catch (e) {
      throw new Error(`Application submission failed`)
    }
  }
}

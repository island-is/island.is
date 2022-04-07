import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { DrivingLicenseBookService } from '@island.is/api/domains/driving-license-book'
import { DrivingSchool, DrivingSchoolType } from './types'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class DrivingSchoolConfirmationService {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {}

  async submitApplication({
    application: { answers, externalData },
    auth,
  }: TemplateApiModuleActionProps) {
    console.log('DRIVING SCHOOL SERVICE')
    console.log(answers)
    // TODO: Confirmation email
    const nationalId = getValueViaPath<string>(answers, 'nationalId')
    const email = getValueViaPath<string>(answers, 'email')

    const confirmation = getValueViaPath<{ date: string; school: string }>(
      answers,
      'confirmation',
    )
    if (!confirmation) {
      throw new Error(`Missing date and school`)
    }
    const schoolNationlId = (externalData.employee.data as DrivingSchool)
      .nationalId
    console.log({
      bookId: '398D2BEA-0ABE-49CF-88EE-171E83F058DE',
      schoolTypeId: parseInt(confirmation?.school),
      schoolNationlId: schoolNationlId,
      schoolEmployeeNationalId: auth.nationalId,
      createdOn: confirmation?.date,
      comments: '',
    })
    try {
      const result = await this.drivingLicenseBookService.createDrivingSchoolTestResult(
        {
          bookId: '398D2BEA-0ABE-49CF-88EE-171E83F058DE',
          schoolTypeId: parseInt(confirmation?.school),
          schoolNationlId: schoolNationlId,
          schoolEmployeeNationalId: auth.nationalId,
          createdOn: confirmation?.date,
          comments: '',
        },
      )

      if (!result) {
        throw new Error(`Application submission failed`)
      }

      return { success: true, id: result.id }
    } catch (e) {
        throw new Error(`Application submission failed`)
    }
  }
}

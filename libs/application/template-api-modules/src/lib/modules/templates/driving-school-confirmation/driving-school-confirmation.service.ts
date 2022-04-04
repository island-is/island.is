import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { DrivingLicenseBookService } from '@island.is/api/domains/driving-license-book'
import { DrivingSchool, DrivingSchoolType } from './types'

@Injectable()
export class DrivingSchoolConfirmationService {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {}

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    // const schoolType = (application.externalData.schoolTypes
    //   .data as DrivingSchoolType[]).find(
    //   (type) => type.schoolTypeCode === application.answers.schoolTypeCode,
    // )
    // const payload = {
    //   bookId: '',
    //   schoolTypeId: schoolType?.schoolTypeId,
    //   schoolNationlId:
    //     (application.externalData.employee?.data as DrivingSchool).nationalId ??
    //     '',
    //   schoolEmployeeNationalId: auth.nationalId,
    //   createdOn: '',
    //   comments: '',
    // }

    return { success: true, id: '123' }
  }
}

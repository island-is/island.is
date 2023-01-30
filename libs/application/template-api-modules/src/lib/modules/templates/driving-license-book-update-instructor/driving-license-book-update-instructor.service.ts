import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { DrivingLicenseBookService } from '@island.is/api/domains/driving-license-book'
import { DrivingLicenseBookUpdateInstructorAnswers } from '@island.is/application/templates/driving-license-book-update-instructor'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

@Injectable()
export class DrivingLicenseBookUpdateInstructorService extends BaseTemplateApiService {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {
    super(ApplicationTypes.DRIVING_LICENSE_BOOK_UPDATE_INSTRUCTOR)
  }

  async getCurrentInstructor({ auth }: TemplateApiModuleActionProps) {
    const overview = await this.drivingLicenseBookService.getMostRecentStudentBook(
      auth,
    )

    if (!overview?.active) {
      throw new Error('Did not find active student book')
    }

    const teacherNationalId = overview.book?.teacherNationalId
    const teacherName = overview.book?.teacherName

    return teacherNationalId
      ? {
          nationalId: teacherNationalId,
          name: teacherName,
        }
      : null
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as DrivingLicenseBookUpdateInstructorAnswers

    const newInstructorSsn = answers?.newInstructor?.nationalId

    if (!newInstructorSsn) {
      throw new Error('New instructor national id is empty')
    }

    const {
      success,
    } = await this.drivingLicenseBookService.updateActiveStudentBookInstructor(
      auth,
      newInstructorSsn,
    )

    if (!success) {
      throw new Error('Error updating driving license book instructor')
    }
  }
}

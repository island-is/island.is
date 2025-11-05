import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { DrivingLicenseBookUpdateInstructorAnswers } from '@island.is/application/templates/transport-authority/driving-license-book-update-instructor'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { DrivingLicenseBookClientApiFactory } from '@island.is/clients/driving-license-book'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class DrivingLicenseBookUpdateInstructorService extends BaseTemplateApiService {
  constructor(
    @Inject(DrivingLicenseBookClientApiFactory)
    private drivingLicenseBookClientApiFactory: DrivingLicenseBookClientApiFactory,
  ) {
    super(ApplicationTypes.DRIVING_LICENSE_BOOK_UPDATE_INSTRUCTOR)
  }

  async getCurrentInstructor({ auth }: TemplateApiModuleActionProps) {
    const activeBook =
      await this.drivingLicenseBookClientApiFactory.getActiveStudentBook(auth)

    if (!activeBook) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.drivingLicenseBookActiveBookNotFound,
          summary: coreErrorMessages.drivingLicenseBookActiveBookNotFound,
        },
        400,
      )
    }

    const teacherNationalId = activeBook.teacherSsn
    const teacherName = activeBook.teacherName

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
    const answers =
      application.answers as DrivingLicenseBookUpdateInstructorAnswers

    const newInstructorSsn = answers?.newInstructor?.nationalId

    if (!newInstructorSsn) {
      throw new Error('New instructor national id is empty')
    }

    const { success } =
      await this.drivingLicenseBookClientApiFactory.updateActiveStudentBookInstructor(
        auth,
        newInstructorSsn,
      )

    if (!success) {
      throw new Error('Error updating driving license book instructor')
    }
  }
}

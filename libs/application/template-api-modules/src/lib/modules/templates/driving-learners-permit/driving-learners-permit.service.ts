import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class DrivingLearnersPermitService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly drivingLicenseService: DrivingLicenseApi,
  ) {
    super(ApplicationTypes.DRIVING_LEARNERS_PERMIT)
  }

  async completeApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const studentSSN =
      getValueViaPath<string>(
        application.answers,
        'studentMentorability.studentNationalId',
        '',
      ) ?? ''
    const practicePermitApplication = await this.drivingLicenseService.postPracticePermitApplication(
      {
        token: auth.authorization.split(' ')[1], // Used to remove the bearer part
        mentorSSN: application.applicant,
        studentSSN,
      },
    )

    return {
      practicePermitApplication,
    }
  }
}

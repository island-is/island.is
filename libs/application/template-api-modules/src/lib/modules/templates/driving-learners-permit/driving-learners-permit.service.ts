import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'

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
    const practicePermitApplication = await this.drivingLicenseService.postPracticePermitApplication(
      {
        token: auth.authorization.split(' ')[1],
        mentorSSN: application.applicant,
        studentSSN: (application.answers.intro as any).studentSSN,
      },
    )

    return {
      practicePermitApplication,
    }
  }

  async canApplyForPracticePermit({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    const canApply = await this.drivingLicenseService.postCanApplyForPracticePermit(
      {
        token: auth.authorization.split(' ')[1],
        mentorSSN: application.applicant,
        studentSSN: (application.answers.intro as any).studentSSN,
      },
    )
    return canApply.isOk ?? false
  }
}

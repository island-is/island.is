import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { StudentMentorability } from './types'
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

  async completeApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while

    const studentMentorability = (application.answers
      .studentMentorability as unknown) as StudentMentorability

    //TODO: submit this to the driving license service once an endpoint has been created
    const applicationData = {
      student: studentMentorability.studentNationalId,
      mentor: application.applicant,
    }

    return {
      id: 1337,
      applicationData,
    }
  }

  async canApplyForPracticePermit({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    const canApply = await this.drivingLicenseService.canApplyForPracticePermit(
      {
        token: auth.authorization.split(' ')[1],
        mentorSSN: application.applicant,
        studentSSN: (application.answers.intro as any).studentSSN,
      },
    )

    console.log('canApply', canApply)

    return false
  }
}

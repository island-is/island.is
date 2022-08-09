import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { generateAssignApplicationEmail } from './emailGenerators'
import { StudentMentorability } from './types'

const TWO_HOURS_IN_SECONDS = 2 * 60 * 60
@Injectable()
export class DrivingLearnersPermitService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignApplicationEmail,
      application,
      TWO_HOURS_IN_SECONDS,
    )

    return {
      id: 1337,
    }
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
}

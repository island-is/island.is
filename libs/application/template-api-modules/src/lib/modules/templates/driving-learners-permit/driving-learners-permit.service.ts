import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { StudentMentorability } from './types'

@Injectable()
export class DrivingLearnersPermitService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

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

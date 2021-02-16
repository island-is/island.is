import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateAssignReviewerEmail,
  generateApplicationApprovedEmail,
  generateApplicationRejectedEmail,
} from './emailGenerators'

@Injectable()
export class DocumentProviderOnboardingService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async assignReviewer({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignReviewerEmail,
      application,
    )
  }
  async applicationApproved({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
  }
  async applicationRejected({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationRejectedEmail,
      application,
    )
  }
}

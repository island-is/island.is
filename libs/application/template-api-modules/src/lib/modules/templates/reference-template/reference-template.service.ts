import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateApplicationApprovedEmail,
  generateAssignApplicationEmail,
} from './emailGenerators'

const TWO_HOURS_IN_SECONDS = 2 * 60 * 60
@Injectable()
export class ReferenceTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  // A test action that can be used in the ReferenceApplicationTemplate to see
  // what happens when an api action fails
  async doStuffThatFails() {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    throw new Error('This is the message that caused the failure')
  }

  async createApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const token = await this.sharedTemplateAPIService.createAssignToken(
      application,
      TWO_HOURS_IN_SECONDS,
    )

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignApplicationEmail,
      application,
      token,
    )

    return {
      id: 1337,
    }
  }

  async completeApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Use the shared service to send an email using a custom email generator
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )

    return {
      id: 1337,
    }
  }
}

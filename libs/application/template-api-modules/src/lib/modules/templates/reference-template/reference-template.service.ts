import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { getValueViaPath } from '@island.is/application/core'
import {
  generateApplicationApprovedEmail,
  generateAssignApplicationEmail,
} from './emailGenerators'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { NotificationsService } from '../../../notification/notifications.service'

const TWO_HOURS_IN_SECONDS = 2 * 60 * 60
@Injectable()
export class ReferenceTemplateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
  ) {
    super('test')
  }

  async getReferenceData({ application }: TemplateApiModuleActionProps) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const applicantName = getValueViaPath<string>(
      application.externalData,
      'nationalRegistry.data.fullName',
    )

    return {
      referenceData: {
        applicantName,
        some: 'data',
        numbers: 123,
      },
    }
  }

  async getAnotherReferenceData() {
    return {
      anotherData: {
        stuff: 'someDataString',
      },
    }
  }

  // A test action that can be used in the ReferenceApplicationTemplate to see
  // what happens when an api action fails
  async doStuffThatFails() {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    throw new TemplateApiError(
      {
        title: 'This is a test error',
        summary: 'This is the message that caused the failure',
      },
      500,
    )
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

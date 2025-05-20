import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import { NotificationType } from '../../../../notification/notificationsTemplates'

@Injectable()
export class ExampleCommonActionsService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
  ) {
    super(ApplicationTypes.EXAMPLE_COMMON_ACTIONS)
  }

  async getReferenceData({ application, auth }: TemplateApiModuleActionProps) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const applicantName = getValueViaPath(
      application.externalData,
      'nationalRegistry.data.fullName',
    ) as string

    this.notificationsService.sendNotification({
      type: NotificationType.ChildrenResidenceChange,
      messageParties: {
        recipient: auth.nationalId,
        sender: auth.nationalId,
      },
      args: {
        applicantName,
        applicationId: application.id,
      },
    })

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

  async createApplication() {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }

  async completeApplication() {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Use the shared service to send an email using a custom email generator

    return {
      id: 1337,
    }
  }
}

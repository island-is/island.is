import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { sendHnipp } from './hnipp'

// const TWO_HOURS_IN_SECONDS = 2 * 60 * 60
@Injectable()
export class ExampleStateTransfersService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
  ) {
    super(ApplicationTypes.EXAMPLE_STATE_TRANSFERS)
  }

  async createApplication() {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }

  // This function is called when the application goes from DRAFT -> COMPLETE
  async completeApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Here you write logic to submit the application to a organization
    // Parse the answers from the application
    // Import a client and submit the info

    return {
      id: 1337,
    }
  }

  // This function is called when the application goes from DRAFT -> REVIEW
  async moveToReviewState({ application }: TemplateApiModuleActionProps) {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    sendHnipp(application, this.notificationsService.sendNotification)

    return {
      id: 1337,
    }
  }

  // This function is called when the application goes from REVIEW -> APPROVED
  async approveApplication({ application }: TemplateApiModuleActionProps) {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    sendHnipp(application, this.notificationsService.sendNotification)
  }

  // This function is called when the application goes from REVIEW -> REJECTED
  async rejectApplication({ application }: TemplateApiModuleActionProps) {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    sendHnipp(application, this.notificationsService.sendNotification)
  }
}

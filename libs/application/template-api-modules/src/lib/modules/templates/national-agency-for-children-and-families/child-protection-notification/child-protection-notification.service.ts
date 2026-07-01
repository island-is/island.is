import { ApplicationTypes } from '@island.is/application/types'
import { Injectable } from '@nestjs/common'
import {
  ExternalDropdownApi,
  ExternalNotificationApi,
} from '@island.is/clients/national-agency-for-children-and-families'

import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { SharedTemplateApiService } from '../../../shared'

@Injectable()
export class ChildProtectionNotificationService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly dropdownApi: ExternalDropdownApi,
    private readonly notificationApi: ExternalNotificationApi,
  ) {
    super(ApplicationTypes.CHILD_PROTECTION_NOTIFICATION)
  }

  async createApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }

  async completeApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }
}

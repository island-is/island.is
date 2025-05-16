import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../base-template-api.service'

@Injectable()
export class ActivationAllowanceService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
  ) {
    super(ApplicationTypes.ACTIVATION_ALLOWANCE)
  }
  // TODO: Implement functions as needed

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

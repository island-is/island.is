import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'

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

  async completeApplication() {
    // Pretend to be doing stuff for a short while
    console.log('-------------------completeApplication---------------')
    await new Promise((resolve) => setTimeout(resolve, 8000))

    return {
      id: 1337,
    }
  }
}

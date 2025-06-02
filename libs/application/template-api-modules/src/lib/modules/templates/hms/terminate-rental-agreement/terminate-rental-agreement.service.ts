import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../..'

@Injectable()
export class TerminateRentalAgreementService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
  ) {
    super(ApplicationTypes.TERMINATE_RENTAL_AGREEMENT)
  }

  async getRentalAgreements({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    return [
      {
        id: 1,
        name: 'Leigusamningur 1',
        status: 'active',
      },
      {
        id: 2,
        name: 'Leigusamningur 2',
        status: 'active',
      },
    ]
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

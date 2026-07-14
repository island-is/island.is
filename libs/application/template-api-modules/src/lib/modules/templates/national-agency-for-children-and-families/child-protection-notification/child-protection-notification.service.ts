import { ApplicationTypes } from '@island.is/application/types'
import { NationalAgencyForChildrenAndFamiliesClientService } from '@island.is/clients/national-agency-for-children-and-families'
import { Injectable } from '@nestjs/common'

import { NotificationsService } from '../../../../notification/notifications.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { SharedTemplateApiService } from '../../../shared'

@Injectable()
export class ChildProtectionNotificationService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly nationalAgencyForChildrenAndFamiliesClientService: NationalAgencyForChildrenAndFamiliesClientService,
  ) {
    super(ApplicationTypes.CHILD_PROTECTION_NOTIFICATION)
  }

  async getCategories({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getCategories(
      auth,
    )
  }

  async getProtectiveFactors({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getProtectiveFactors(
      auth,
    )
  }

  async getGenders({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getGenders(
      auth,
    )
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

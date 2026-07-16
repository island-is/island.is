import { getApplicationAnswers } from '@island.is/application/templates/national-agency-for-children-and-families/child-protection-notification'
import { ApplicationTypes } from '@island.is/application/types'
import { NationalAgencyForChildrenAndFamiliesClientService } from '@island.is/clients/national-agency-for-children-and-families'
import { FriggClientService } from '@island.is/clients/mms/frigg'
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
    private readonly friggClientService: FriggClientService,
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

  async getChildInformation({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const { childNationalId } = getApplicationAnswers(application.answers)

    if (!childNationalId) {
      return { childFoundInFrigg: false, languageEnvironmentOptions: [] }
    }

    const user = await this.friggClientService.getUserById(
      auth,
      childNationalId,
    )
    const childFoundInFrigg = 'id' in user

    if (childFoundInFrigg) {
      return { childFoundInFrigg: true, languageEnvironmentOptions: [] }
    }

    const keyOptions = await this.friggClientService.getAllKeyOptions(
      auth,
      'languageEnvironment',
    )
    return {
      childFoundInFrigg: false,
      languageEnvironmentOptions: keyOptions[0]?.options ?? [],
    }
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

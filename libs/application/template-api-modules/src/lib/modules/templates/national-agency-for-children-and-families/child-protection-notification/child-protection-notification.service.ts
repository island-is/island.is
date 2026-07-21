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

  async getPostalCodes({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getPostalCodes(
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

  async getUrgencyAssessments({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getUrgencyAssessments(
      auth,
    )
  }

  // TODO: Submit the notification to the National Agency for Children and Families
  async createNotification() {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }

  // TODO: Mark the notification as complete after submission
  async completeNotification() {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }
}

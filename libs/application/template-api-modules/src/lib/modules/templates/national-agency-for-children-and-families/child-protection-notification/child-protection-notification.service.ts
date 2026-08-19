import { getApplicationAnswers } from '@island.is/application/templates/national-agency-for-children-and-families/child-protection-notification'
import { ApplicationTypes } from '@island.is/application/types'
import { FriggClientService } from '@island.is/clients/mms/frigg'
import { NationalAgencyForChildrenAndFamiliesClientService } from '@island.is/clients/national-agency-for-children-and-families'
import { Injectable } from '@nestjs/common'

import { NotificationsService } from '../../../../notification/notifications.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { SharedTemplateApiService } from '../../../shared'
import { NationalRegistryV3Service } from '../../../shared/api/national-registry-v3/national-registry-v3.service'

@Injectable()
export class ChildProtectionNotificationService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly nationalAgencyForChildrenAndFamiliesClientService: NationalAgencyForChildrenAndFamiliesClientService,
    private readonly friggClientService: FriggClientService,
    private readonly nationalRegistryV3Service: NationalRegistryV3Service,
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

  async getChildUnknownNationalIdStates({
    auth,
  }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getChildUnknownNationalIdStates(
      auth,
    )
  }

  async getGuardianNotAwareReasons({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getGuardianNotAwareReasons(
      auth,
    )
  }

  async getSchoolTypes({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getSchoolTypes(
      auth,
    )
  }

  async getLanguageEnvironments({ auth }: TemplateApiModuleActionProps) {
    const keyOptions = await this.friggClientService.getAllKeyOptions(
      auth,
      'languageEnvironment',
    )
    return keyOptions[0]?.options ?? []
  }

  async getChildSafetyLevels({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getChildSafetyLevels(
      auth,
    )
  }

  async getPronouns({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getPronouns(
      auth,
    )
  }

  async getDisabilityStatuses({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getDisabilityStatuses(
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

  async getChildNationalIdType({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const { childNationalId } = getApplicationAnswers(application.answers)

    if (!childNationalId) return undefined

    return this.nationalRegistryV3Service.getNationalIdType(
      childNationalId,
      auth,
    )
  }

  async getNotifierRoles({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getNotifierRoles(
      auth,
    )
  }

  async getNotifierRoleSubTypes({ auth }: TemplateApiModuleActionProps) {
    return await this.nationalAgencyForChildrenAndFamiliesClientService.getNotifierRoleSubTypes(
      auth,
    )
  }
}

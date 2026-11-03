import { getApplicationAnswers } from '@island.is/application/templates/national-agency-for-children-and-families/child-protection-notification'
import { ApplicationTypes } from '@island.is/application/types'
import {
  NationalAgencyForChildrenAndFamiliesClientService,
  NotificationGeneralPublicRequest,
} from '@island.is/clients/national-agency-for-children-and-families'
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
    private readonly nationalRegistryV3Service: NationalRegistryV3Service,
  ) {
    super(ApplicationTypes.CHILD_PROTECTION_NOTIFICATION)
  }

  async getCategories() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getCategories()
  }

  async getProtectiveFactors() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getProtectiveFactors()
  }

  async getGenders() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getGenders()
  }

  async getPostalCodes() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getPostalCodes()
  }

  async getChildUnknownNationalIdStates() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getChildUnknownNationalIdStates()
  }

  async getGuardianNotAwareReasons() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getGuardianNotAwareReasons()
  }

  async getSchoolTypes() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getSchoolTypes()
  }

  async getChildSafetyLevels() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getChildSafetyLevels()
  }

  async getPronouns() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getPronouns()
  }

  async getDisabilityStatuses() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getDisabilityStatuses()
  }

  // TODO: Map application answers to the request body.
  async createNotification({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const answers = getApplicationAnswers(application.answers)

    const body = {
      // TODO: Map answers fields here
    } as NotificationGeneralPublicRequest

    return await this.nationalAgencyForChildrenAndFamiliesClientService.createNotification(
      auth,
      body,
    )
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

  async getNotifierRoles() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getNotifierRoles()
  }

  async getNotifierRoleSubTypes() {
    return this.nationalAgencyForChildrenAndFamiliesClientService.getNotifierRoleSubTypes()
  }
}

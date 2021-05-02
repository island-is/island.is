import { Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/core'

import { TemplateApiModuleActionProps } from '../types'

import {
  ParentalLeaveService,
  ReferenceTemplateService,
  DocumentProviderOnboardingService,
  HealthInsuranceService,
  InstitutionCollaborationService,
  ChildrenResidenceChangeService,
  PartyLetterService,
} from './templates'

interface ApplicationApiAction {
  templateId: string
  type: string
  props: TemplateApiModuleActionProps
}

type PerformActionResult =
  | {
      success: true
      response: unknown
    }
  | {
      success: false
      error: string
    }

@Injectable()
export class TemplateAPIService {
  constructor(
    private readonly parentalLeaveService: ParentalLeaveService,
    private readonly referenceTemplateService: ReferenceTemplateService,
    private readonly documentProviderOnboardingService: DocumentProviderOnboardingService,
    private readonly healthInsuranceService: HealthInsuranceService,
    private readonly institutionApplicationService: InstitutionCollaborationService,
    private readonly childrenResidenceChangeService: ChildrenResidenceChangeService,
    private readonly partyLetterService: PartyLetterService,
  ) {}

  private async tryRunningActionOnService(
    service:
      | ReferenceTemplateService
      | ParentalLeaveService
      | DocumentProviderOnboardingService
      | HealthInsuranceService
      | InstitutionCollaborationService
      | ChildrenResidenceChangeService
      | PartyLetterService,
    action: ApplicationApiAction,
  ): Promise<PerformActionResult> {
    // No index signature with a parameter of type 'string' was found on type
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof service[action.type] === 'function') {
      try {
        // No index signature with a parameter of type 'string' was found on type
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const response = await service[action.type](action.props)

        return {
          success: true,
          response,
        }
      } catch (e) {
        return {
          success: false,
          error: e.message,
        }
      }
    }

    return {
      success: false,
      error: 'action.invalid',
    }
  }

  async performAction(
    action: ApplicationApiAction,
  ): Promise<PerformActionResult> {
    switch (action.templateId) {
      case ApplicationTypes.EXAMPLE:
        return this.tryRunningActionOnService(
          this.referenceTemplateService,
          action,
        )
      case ApplicationTypes.PARENTAL_LEAVE:
        return this.tryRunningActionOnService(this.parentalLeaveService, action)
      case ApplicationTypes.INSTITUTION_COLLABORATION:
        return this.tryRunningActionOnService(
          this.institutionApplicationService,
          action,
        )
      case ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING:
        return this.tryRunningActionOnService(
          this.documentProviderOnboardingService,
          action,
        )
      case ApplicationTypes.HEALTH_INSURANCE:
        return this.tryRunningActionOnService(
          this.healthInsuranceService,
          action,
        )
      case ApplicationTypes.CHILDREN_RESIDENCE_CHANGE:
        return this.tryRunningActionOnService(
          this.childrenResidenceChangeService,
          action,
        )
      case ApplicationTypes.PARTY_LETTER:
        return this.tryRunningActionOnService(this.partyLetterService, action)
    }

    return {
      success: false,
      error: 'invalid template',
    }
  }
}

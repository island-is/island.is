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
  LoginServiceService,
  FundingGovernmentProjectsService,
  PartyLetterService,
  DrivingLicenseSubmissionService,
  PartyApplicationService,
  PayableDummyTemplateService,
  AccidentNotificationService,
  PublicDebtPaymentPlanTemplateService,
  GeneralPetitionService,
  CriminalRecordService,
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
    private readonly loginServiceService: LoginServiceService,
    private readonly fundingGovernmentProjectsService: FundingGovernmentProjectsService,
    private readonly partyLetterService: PartyLetterService,
    private readonly drivingLicenseSubmissionService: DrivingLicenseSubmissionService,
    private readonly partyApplicationService: PartyApplicationService,
    private readonly payableDummyTemplateService: PayableDummyTemplateService,
    private readonly accidentNotificationService: AccidentNotificationService,
    private readonly publicDebtPaymentPlanService: PublicDebtPaymentPlanTemplateService,
    private readonly generalPetitionService: GeneralPetitionService,
    private readonly criminalRecordService: CriminalRecordService,
  ) {}

  private async tryRunningActionOnService(
    service:
      | ReferenceTemplateService
      | ParentalLeaveService
      | DocumentProviderOnboardingService
      | HealthInsuranceService
      | InstitutionCollaborationService
      | ChildrenResidenceChangeService
      | LoginServiceService
      | FundingGovernmentProjectsService
      | PartyLetterService
      | DrivingLicenseSubmissionService
      | PartyApplicationService
      | PayableDummyTemplateService
      | AccidentNotificationService
      | PublicDebtPaymentPlanTemplateService
      | GeneralPetitionService
      | CriminalRecordService,
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
      case ApplicationTypes.LOGIN_SERVICE:
        return this.tryRunningActionOnService(this.loginServiceService, action)
      case ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS:
        return this.tryRunningActionOnService(
          this.fundingGovernmentProjectsService,
          action,
        )
      case ApplicationTypes.PARTY_LETTER:
        return this.tryRunningActionOnService(this.partyLetterService, action)

      case ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL:
        return this.tryRunningActionOnService(
          this.drivingLicenseSubmissionService,
          action,
        )
      case ApplicationTypes.DRIVING_LICENSE:
        return this.tryRunningActionOnService(
          this.drivingLicenseSubmissionService,
          action,
        )
      case ApplicationTypes.PARTY_APPLICATION:
        return this.tryRunningActionOnService(
          this.partyApplicationService,
          action,
        )
      case ApplicationTypes.PAYABLE_DUMMY_TEMPLATE:
        return this.tryRunningActionOnService(
          this.payableDummyTemplateService,
          action,
        )
      case ApplicationTypes.ACCIDENT_NOTIFICATION:
        return this.tryRunningActionOnService(
          this.accidentNotificationService,
          action,
        )
      case ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN:
        return this.tryRunningActionOnService(
          this.publicDebtPaymentPlanService,
          action,
        )
      case ApplicationTypes.GENERAL_PETITION:
        return this.tryRunningActionOnService(
          this.generalPetitionService,
          action,
        )
      case ApplicationTypes.CRIMINAL_RECORD:
        return this.tryRunningActionOnService(
          this.criminalRecordService,
          action,
        )
    }

    return {
      success: false,
      error: 'invalid template',
    }
  }
}

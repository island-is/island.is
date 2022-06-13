import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationTypes,
  PerformActionResult,
} from '@island.is/application/core'
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
  DrivingLicenseSubmissionService,
  AccidentNotificationService,
  PublicDebtPaymentPlanTemplateService,
  GeneralPetitionService,
  CriminalRecordSubmissionService,
  GeneralFishingLicenseService,
  DataProtectionComplaintService,
  PSignSubmissionService,
  ExamplePaymentActionsService,
  ComplaintsToAlthingiOmbudsmanTemplateService,
  MortgageCertificateSubmissionService,
  FinancialAidService,
  DrivingSchoolConfirmationService,
} from './templates'
import { SharedDataProviderService, SharedServiceType } from './shared'
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

interface ApplicationApiAction {
  templateId: string
  type: string
  props: TemplateApiModuleActionProps
  namespace?: string
}

@Injectable()
export class TemplateAPIService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedServicesProvider: SharedDataProviderService,
    private readonly parentalLeaveService: ParentalLeaveService,
    private readonly referenceTemplateService: ReferenceTemplateService,
    private readonly documentProviderOnboardingService: DocumentProviderOnboardingService,
    private readonly healthInsuranceService: HealthInsuranceService,
    private readonly institutionApplicationService: InstitutionCollaborationService,
    private readonly childrenResidenceChangeService: ChildrenResidenceChangeService,
    private readonly loginServiceService: LoginServiceService,
    private readonly fundingGovernmentProjectsService: FundingGovernmentProjectsService,
    private readonly drivingLicenseSubmissionService: DrivingLicenseSubmissionService,
    private readonly accidentNotificationService: AccidentNotificationService,
    private readonly publicDebtPaymentPlanService: PublicDebtPaymentPlanTemplateService,
    private readonly generalPetitionService: GeneralPetitionService,
    private readonly criminalRecordSubmissionService: CriminalRecordSubmissionService,
    private readonly generalFishingLicenseService: GeneralFishingLicenseService,
    private readonly dataProtectionComplaintService: DataProtectionComplaintService,
    private readonly pSignSubmissionService: PSignSubmissionService,
    private readonly examplePaymentActionsService: ExamplePaymentActionsService,
    private readonly complaintsToAlthingiOmbudsman: ComplaintsToAlthingiOmbudsmanTemplateService,
    private readonly mortgageCertificateSubmissionService: MortgageCertificateSubmissionService,
    private readonly financialAidService: FinancialAidService,
    private readonly drivingSchoolConfirmationService: DrivingSchoolConfirmationService,
  ) {
    this.logger = logger.child({ context: 'TemplateAPIService' })
  }

  private async tryRunningActionOnService(
    service:
      | SharedServiceType
      | ReferenceTemplateService
      | ParentalLeaveService
      | DocumentProviderOnboardingService
      | HealthInsuranceService
      | InstitutionCollaborationService
      | ChildrenResidenceChangeService
      | LoginServiceService
      | FundingGovernmentProjectsService
      | DrivingLicenseSubmissionService
      | AccidentNotificationService
      | PublicDebtPaymentPlanTemplateService
      | GeneralPetitionService
      | CriminalRecordSubmissionService
      | GeneralFishingLicenseService
      | DataProtectionComplaintService
      | PSignSubmissionService
      | ExamplePaymentActionsService
      | ComplaintsToAlthingiOmbudsmanTemplateService
      | MortgageCertificateSubmissionService
      | FinancialAidService
      | DrivingSchoolConfirmationService
      | MortgageCertificateSubmissionService,
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
        this.logger.error(e)
        return {
          success: false,
          error: (e as Error).message,
          problemType: (e as ProblemError)?.problem?.type,
        }
      }
    }

    return {
      success: false,
      error: 'action.invalid',
      problemType: ProblemType.HTTP_BAD_REQUEST,
    }
  }

  async performAction(
    action: ApplicationApiAction,
  ): Promise<PerformActionResult> {
    if (action.namespace) {
      const service = this.sharedServicesProvider.getProvider(action.namespace)
      return this.tryRunningActionOnService(service, action)
    }

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
          this.criminalRecordSubmissionService,
          action,
        )
      case ApplicationTypes.GENERAL_FISHING_LICENSE:
        return this.tryRunningActionOnService(
          this.generalFishingLicenseService,
          action,
        )
      case ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT:
        return this.tryRunningActionOnService(
          this.dataProtectionComplaintService,
          action,
        )
      case ApplicationTypes.P_SIGN:
        return this.tryRunningActionOnService(
          this.pSignSubmissionService,
          action,
        )
      case ApplicationTypes.EXAMPLE_PAYMENT:
        return this.tryRunningActionOnService(
          this.examplePaymentActionsService,
          action,
        )
      case ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN:
        return this.tryRunningActionOnService(
          this.complaintsToAlthingiOmbudsman,
          action,
        )
      case ApplicationTypes.MORTGAGE_CERTIFICATE:
        return this.tryRunningActionOnService(
          this.mortgageCertificateSubmissionService,
          action,
        )
      case ApplicationTypes.FINANCIAL_AID:
        return this.tryRunningActionOnService(this.financialAidService, action)
      case ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION:
        return this.tryRunningActionOnService(
          this.drivingSchoolConfirmationService,
          action,
        )
    }

    return {
      success: false,
      error: 'invalid template',
    }
  }
}

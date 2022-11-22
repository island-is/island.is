import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
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
  AnnouncementOfDeathService,
  ExamplePaymentActionsService,
  ComplaintsToAlthingiOmbudsmanTemplateService,
  MortgageCertificateSubmissionService,
  MarriageConditionsSubmissionService,
  FinancialAidService,
  DrivingSchoolConfirmationService,
  PassportService,
  OperatingLicenseService,
  FinancialStatementsInaoTemplateService,
  EstateTemplateService,
  DrivingLicenseDuplicateService,
  AnonymityInVehicleRegistryService,
  ChangeCoOwnerOfVehicleService,
  ChangeOperatorOfVehicleService,
  DigitalTachographCompanyCardService,
  DigitalTachographDriversCardService,
  DigitalTachographWorkshopCardService,
  OrderVehicleRegistrationCertificateService,
  OrderVehicleLicensePlateService,
  TransferOfVehicleOwnershipService,
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
    private readonly drivingLicenseSubmissionService: DrivingLicenseSubmissionService,
    private readonly accidentNotificationService: AccidentNotificationService,
    private readonly publicDebtPaymentPlanService: PublicDebtPaymentPlanTemplateService,
    private readonly generalPetitionService: GeneralPetitionService,
    private readonly criminalRecordSubmissionService: CriminalRecordSubmissionService,
    private readonly generalFishingLicenseService: GeneralFishingLicenseService,
    private readonly dataProtectionComplaintService: DataProtectionComplaintService,
    private readonly pSignSubmissionService: PSignSubmissionService,
    private readonly announcementOfDeathService: AnnouncementOfDeathService,
    private readonly examplePaymentActionsService: ExamplePaymentActionsService,
    private readonly complaintsToAlthingiOmbudsman: ComplaintsToAlthingiOmbudsmanTemplateService,
    private readonly mortgageCertificateSubmissionService: MortgageCertificateSubmissionService,
    private readonly marriageConditionsSubmissionService: MarriageConditionsSubmissionService,
    private readonly financialAidService: FinancialAidService,
    private readonly drivingSchoolConfirmationService: DrivingSchoolConfirmationService,
    private readonly passportService: PassportService,
    private readonly operatingLicenseService: OperatingLicenseService,
    private readonly financialStatementsInaoService: FinancialStatementsInaoTemplateService,
    private readonly estateTemplateService: EstateTemplateService,
    private readonly drivingLicenseDuplicateService: DrivingLicenseDuplicateService,
    private readonly anonymityInVehicleRegistryService: AnonymityInVehicleRegistryService,
    private readonly changeCoOwnerOfVehicleService: ChangeCoOwnerOfVehicleService,
    private readonly changeOperatorOfVehicleService: ChangeOperatorOfVehicleService,
    private readonly digitalTachographCompanyCardService: DigitalTachographCompanyCardService,
    private readonly digitalTachographDriversCardService: DigitalTachographDriversCardService,
    private readonly digitalTachographWorkshopCardService: DigitalTachographWorkshopCardService,
    private readonly orderVehicleRegistrationCertificateService: OrderVehicleRegistrationCertificateService,
    private readonly orderVehicleLicensePlateService: OrderVehicleLicensePlateService,
    private readonly transferOfVehicleOwnershipService: TransferOfVehicleOwnershipService,
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
      | DrivingLicenseSubmissionService
      | AccidentNotificationService
      | PublicDebtPaymentPlanTemplateService
      | GeneralPetitionService
      | CriminalRecordSubmissionService
      | GeneralFishingLicenseService
      | DataProtectionComplaintService
      | PSignSubmissionService
      | AnnouncementOfDeathService
      | ExamplePaymentActionsService
      | ComplaintsToAlthingiOmbudsmanTemplateService
      | MortgageCertificateSubmissionService
      | MarriageConditionsSubmissionService
      | FinancialAidService
      | DrivingSchoolConfirmationService
      | PassportService
      | OperatingLicenseService
      | FinancialStatementsInaoTemplateService
      | EstateTemplateService
      | DrivingLicenseDuplicateService
      | AnonymityInVehicleRegistryService
      | ChangeCoOwnerOfVehicleService
      | ChangeOperatorOfVehicleService
      | DigitalTachographCompanyCardService
      | DigitalTachographDriversCardService
      | DigitalTachographWorkshopCardService
      | OrderVehicleRegistrationCertificateService
      | OrderVehicleLicensePlateService
      | TransferOfVehicleOwnershipService,
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
          error: (e as Error).message,
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
      case ApplicationTypes.ESTATE:
        return this.tryRunningActionOnService(
          this.estateTemplateService,
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
      case ApplicationTypes.ANNOUNCEMENT_OF_DEATH:
        return this.tryRunningActionOnService(
          this.announcementOfDeathService,
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
      case ApplicationTypes.PASSPORT:
        return this.tryRunningActionOnService(this.passportService, action)
      case ApplicationTypes.MARRIAGE_CONDITIONS:
        return this.tryRunningActionOnService(
          this.marriageConditionsSubmissionService,
          action,
        )
      case ApplicationTypes.OPERATING_LCENSE:
        return this.tryRunningActionOnService(
          this.operatingLicenseService,
          action,
        )
      case ApplicationTypes.FINANCIAL_STATEMENTS_INAO:
        return this.tryRunningActionOnService(
          this.financialStatementsInaoService,
          action,
        )
      case ApplicationTypes.DRIVING_LICENSE_DUPLICATE:
        return this.tryRunningActionOnService(
          this.drivingLicenseDuplicateService,
          action,
        )
      case ApplicationTypes.ANONYMITY_IN_VEHICLE_REGISTRY:
        return this.tryRunningActionOnService(
          this.anonymityInVehicleRegistryService,
          action,
        )
      case ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE:
        return this.tryRunningActionOnService(
          this.changeCoOwnerOfVehicleService,
          action,
        )
      case ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE:
        return this.tryRunningActionOnService(
          this.changeOperatorOfVehicleService,
          action,
        )
      case ApplicationTypes.DIGITAL_TACHOGRAPH_COMPANY_CARD:
        return this.tryRunningActionOnService(
          this.digitalTachographCompanyCardService,
          action,
        )
      case ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD:
        return this.tryRunningActionOnService(
          this.digitalTachographDriversCardService,
          action,
        )
      case ApplicationTypes.DIGITAL_TACHOGRAPH_WORKSHOP_CARD:
        return this.tryRunningActionOnService(
          this.digitalTachographWorkshopCardService,
          action,
        )
      case ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE:
        return this.tryRunningActionOnService(
          this.orderVehicleRegistrationCertificateService,
          action,
        )
      case ApplicationTypes.ORDER_VEHICLE_REGISTRATION_CERTIFICATE:
        return this.tryRunningActionOnService(
          this.orderVehicleLicensePlateService,
          action,
        )
      case ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP:
        return this.tryRunningActionOnService(
          this.transferOfVehicleOwnershipService,
          action,
        )
    }

    return {
      success: false,
      error: 'invalid template',
    }
  }
}

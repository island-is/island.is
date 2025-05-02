import { ExampleAuthDelegationModule } from './examples/example-auth-delegation/example-auth-delegation.module'
import { ExampleAuthDelegationService } from './examples/example-auth-delegation/example-auth-delegation.service'
import { ReferenceTemplateModule } from './reference-template/reference-template.module'
import { ReferenceTemplateService } from './reference-template/reference-template.service'
import { ExamplePaymentActionsModule } from './example-payment-actions/examplePaymentActions.module'
import { ExamplePaymentActionsService } from './example-payment-actions/examplePaymentActions.service'
import { ExampleCommonActionsModule } from './examples/example-common-actions/example-common-actions.module'
import { ExampleCommonActionsService } from './examples/example-common-actions/example-common-actions.service'
import { ExampleStateTransfersModule } from './examples/example-state-transfers/example-state-transfers.module'
import { ExampleStateTransfersService } from './examples/example-state-transfers/example-state-transfers.service'
import { ExampleInputsModule } from './examples/example-inputs/example-inputs.module'
import { ExampleInputsService } from './examples/example-inputs/example-inputs.service'
import { ExampleNoInputsModule } from './examples/example-no-inputs/example-no-inputs.module'
import { ExampleNoInputsService } from './examples/example-no-inputs/example-no-inputs-service'
import { AccidentNotificationModule } from './accident-notification/accident-notification.module'
import { AccidentNotificationService } from './accident-notification/accident-notification.service'
import { AnnouncementOfDeathModule } from './announcement-of-death/announcement-of-death.module'
import { AnnouncementOfDeathService } from './announcement-of-death/announcement-of-death.service'
import { ChildrenResidenceChangeModuleV2 } from './children-residence-change-v2/children-residence-change.module'
import { ChildrenResidenceChangeServiceV2 } from './children-residence-change-v2/children-residence-change.service'
import { ComplaintsToAlthingiOmbudsmanTemplateModule } from './complaints-to-althingi-ombudsman/complaints-to-althingi-ombudsman.module'
import { ComplaintsToAlthingiOmbudsmanTemplateService } from './complaints-to-althingi-ombudsman/complaints-to-althingi-ombudsman.service'
import { CriminalRecordSubmissionModule } from './criminal-record-submission/criminal-record-submission.module'
import { CriminalRecordSubmissionService } from './criminal-record-submission/criminal-record-submission.service'
import { DataProtectionComplaintModule } from './data-protection-complaint/data-protection-complaint.module'
import { DataProtectionComplaintService } from './data-protection-complaint/data-protection-complaint.service'
import { DocumentProviderOnboardingModule } from './document-provider-onboarding/document-provider-onboarding.module'
import { DocumentProviderOnboardingService } from './document-provider-onboarding/document-provider-onboarding.service'
import { DrivingLicenseSubmissionModule } from './driving-license-submission/driving-license-submission.module'
import { DrivingLicenseSubmissionService } from './driving-license-submission/driving-license-submission.service'
import { DrivingSchoolConfirmationModule } from './driving-school-confirmation/driving-school-confirmation.module'
import { DrivingSchoolConfirmationService } from './driving-school-confirmation/driving-school-confirmation.service'
import { EstateTemplateModule } from './estate/estate.module'
import { EstateTemplateService } from './estate/estate.service'
import { FinancialAidModule } from './financial-aid/financial-aid.module'
import { FinancialAidService } from './financial-aid/financial-aid.service'
import { FinancialStatementCemeteryTemplateModule } from './financial-statement-cemetery/financial-statement-cemetery.module'
import { FinancialStatementCemeteryTemplateService } from './financial-statement-cemetery/financial-statement-cemetery.service'
import { FinancialStatementsInaoTemplateModule } from './financial-statements-inao/financial-statements-inao.module'
import { FinancialStatementsInaoTemplateService } from './financial-statements-inao/financial-statements-inao.service'
import { FinancialStatementIndividualElectionModule } from './financial-statement-individual-election/financial-statement-individual-election.module'
import { FinancialStatementIndividualElectionService } from './financial-statement-individual-election/financial-statement-individual-election.service'
import { FinancialStatementPoliticalPartyTemplateModule } from './financial-statement-political-party/financial-statement-political-party.modules'
import { FinancialStatementPoliticalPartyTemplateService } from './financial-statement-political-party/financial-statement-political-party.service'
import { FundingGovernmentProjectsModule } from './funding-government-projects/funding-government-projects.module'
import { FundingGovernmentProjectsService } from './funding-government-projects/funding-government-projects.service'
import { GeneralFishingLicenseModule } from './general-fishing-license/general-fishing-license.module'
import { GeneralFishingLicenseService } from './general-fishing-license/general-fishing-license.service'
import { GeneralPetitionModule } from './general-petition/general-petition.module'
import { GeneralPetitionService } from './general-petition/general-petition.service'
import { HealthInsuranceModule } from './health-insurance/health-insurance.module'
import { HealthInsuranceService } from './health-insurance/health-insurance.service'
import { InheritanceReportModule } from './inheritance-report/inheritance-report.module'
import { InheritanceReportService } from './inheritance-report/inheritance-report.service'
import { InstitutionCollaborationModule } from './institution-collaboration/institution-collaboration.module'
import { InstitutionCollaborationService } from './institution-collaboration/institution-collaboration.service'
import { LoginServiceModule } from './login-service/login-service.module'
import { LoginServiceService } from './login-service/login-service.service'
import { MarriageConditionsSubmissionModule } from './marriage-conditions-submission/marriage-conditions-submission.module'
import { MarriageConditionsSubmissionService } from './marriage-conditions-submission/marriage-conditions-submission.service'
import { MortgageCertificateSubmissionModule } from './mortgage-certificate-submission/mortgage-certificate-submission.module'
import { MortgageCertificateSubmissionService } from './mortgage-certificate-submission/mortgage-certificate-submission.service'
import { NoDebtCertificateModule } from './no-debt-certificate/no-debt-certificate.module'
import { NoDebtCertificateService } from './no-debt-certificate/no-debt-certificate.service'
import { OperatingLicenseModule } from './operating-license/operatingLicense.module'
import { OperatingLicenseService } from './operating-license/operatingLicense.service'
import { PSignSubmissionModule } from './p-sign-submission/p-sign-submission.module'
import { PSignSubmissionService } from './p-sign-submission/p-sign-submission.service'
import { ParentalLeaveModule } from './parental-leave/parental-leave.module'
import { ParentalLeaveService } from './parental-leave/parental-leave.service'
import { PassportAnnulmentModule } from './passport-annulment/passport-annulment.module'
import { PassportAnnulmentService } from './passport-annulment/passport-annulment.service'
import { PassportModule } from './passport/passport.module'
import { PassportService } from './passport/passport.service'
import { PublicDebtPaymentPlanTemplateModule } from './public-debt-payment-plan/public-debt-payment-plan.module'
import { PublicDebtPaymentPlanTemplateService } from './public-debt-payment-plan/public-debt-payment-plan.service'
import { CitizenshipModule } from './directorate-of-immigration/citizenship/citizenship.module'
import { CitizenshipService } from './directorate-of-immigration/citizenship/citizenship.service'
import { DrivingLearnersPermitModule } from './driving-learners-permit/driving-learners-permit.module'
import { DrivingLearnersPermitService } from './driving-learners-permit/driving-learners-permit.service'
import { DrivingLicenseBookUpdateInstructorModule } from './driving-license-book-update-instructor/driving-license-book-update-instructor.module'
import { DrivingLicenseBookUpdateInstructorService } from './driving-license-book-update-instructor/driving-license-book-update-instructor.service'
import {
  EuropeanHealthInsuranceCardModule,
  EuropeanHealthInsuranceCardService,
} from './european-health-insurance-card'
import { HealthcareLicenseCertificateModule } from './healthcare-license-certificate/healthcare-license-certificate.module'
import { HealthcareLicenseCertificateService } from './healthcare-license-certificate/healthcare-license-certificate.service'
import { HealthcareWorkPermitModule } from './healthcare-work-permit/healthcare-work-permit.module'
import { HealthcareWorkPermitService } from './healthcare-work-permit/healthcare-work-permit.service'
import { AnonymityInVehicleRegistryModule } from './transport-authority/anonymity-in-vehicle-registry/anonymity-in-vehicle-registry.module'
import { AnonymityInVehicleRegistryService } from './transport-authority/anonymity-in-vehicle-registry/anonymity-in-vehicle-registry.service'
import { ChangeCoOwnerOfVehicleModule } from './transport-authority/change-co-owner-of-vehicle/change-co-owner-of-vehicle.module'
import { ChangeCoOwnerOfVehicleService } from './transport-authority/change-co-owner-of-vehicle/change-co-owner-of-vehicle.service'
import { ChangeOperatorOfVehicleModule } from './transport-authority/change-operator-of-vehicle/change-operator-of-vehicle.module'
import { ChangeOperatorOfVehicleService } from './transport-authority/change-operator-of-vehicle/change-operator-of-vehicle.service'
import { DigitalTachographDriversCardModule } from './transport-authority/digital-tachograph-drivers-card/digital-tachograph-drivers-card.module'
import { DigitalTachographDriversCardService } from './transport-authority/digital-tachograph-drivers-card/digital-tachograph-drivers-card.service'
import { LicensePlateRenewalModule } from './transport-authority/license-plate-renewal/license-plate-renewal.module'
import { LicensePlateRenewalService } from './transport-authority/license-plate-renewal/license-plate-renewal.service'
import { OrderVehicleLicensePlateModule } from './transport-authority/order-vehicle-license-plate/order-vehicle-license-plate.module'
import { OrderVehicleLicensePlateService } from './transport-authority/order-vehicle-license-plate/order-vehicle-license-plate.service'
import { OrderVehicleRegistrationCertificateModule } from './transport-authority/order-vehicle-registration-certificate/order-vehicle-registration-certificate.module'
import { OrderVehicleRegistrationCertificateService } from './transport-authority/order-vehicle-registration-certificate/order-vehicle-registration-certificate.service'
import { TransferOfVehicleOwnershipModule } from './transport-authority/transfer-of-vehicle-ownership/transfer-of-vehicle-ownership.module'
import { TransferOfVehicleOwnershipService } from './transport-authority/transfer-of-vehicle-ownership/transfer-of-vehicle-ownership.service'
import { EnergyFundsModule } from './energy-funds/energy-funds.module'
import { EnergyFundsService } from './energy-funds/energy-funds.service'
import { UniversityModule } from './university/university.module'
import { UniversityService } from './university/university.service'
import { TransferOfMachineOwnershipTemplateModule } from './aosh/transfer-of-machine-ownership/transfer-of-machine-ownership.module'
import { TransferOfMachineOwnershipTemplateService } from './aosh/transfer-of-machine-ownership/transfer-of-machine-ownership.service'
import { CarRecyclingModule } from './car-recycling/car-recycling.module'
import { CarRecyclingService } from './car-recycling/car-recycling.service'
import { DrivingLicenseDuplicateModule } from './driving-license-duplicate/driving-license-duplicate.module'
import { DrivingLicenseDuplicateService } from './driving-license-duplicate/driving-license-duplicate.service'
import { OfficialJournalOfIcelandTemplateModule } from './official-journal-of-iceland/official-journal-of-iceland.module'
import { OfficialJournalOfIcelandTemaplateService } from './official-journal-of-iceland/official-journal-of-iceland.service'
import { SocialInsuranceAdministrationModule } from './social-insurance-administration/social-insurance-administration.module'
import { SocialInsuranceAdministrationService } from './social-insurance-administration/social-insurance-administration.service'
import { ChangeMachineSupervisorTemplateModule } from './aosh/change-machine-supervisor/change-machine-supervisor.module'
import { ChangeMachineSupervisorTemplateService } from './aosh/change-machine-supervisor/change-machine-supervisor.service'
import { SignatureListCreationModule } from './signature-collection/signature-list-creation/signature-list-creation.module'
import { SignatureListCreationService } from './signature-collection/signature-list-creation/signature-list-creation.service'
import { SignatureListSigningModule } from './signature-collection/signature-list-signing/signature-list-signing.module'
import { SignatureListSigningService } from './signature-collection/signature-list-signing/signature-list-signing.service'
import { HomeSupportModule } from './home-support/home-support.module'
import { HomeSupportService } from './home-support/home-support.service'
import { DeregisterMachineTemplateModule } from './aosh/deregister-machine/deregister-machine.module'
import { DeregisterMachineTemplateService } from './aosh/deregister-machine/deregister-machine.service'
import { RegisterNewMachineTemplateModule } from './aosh/register-new-machine/register-new-machine.module'
import { RegisterNewMachineTemplateService } from './aosh/register-new-machine/register-new-machine.service'
import { GrindavikHousingBuyoutModule } from './grindavik-housing-buyout/grindavik-housing-buyout.module'
import { GrindavikHousingBuyoutService } from './grindavik-housing-buyout/grindavik-housing-buyout.service'
import { StreetRegistrationTemplateModule } from './aosh/street-registration/street-registration.module'
import { StreetRegistrationTemplateService } from './aosh/street-registration/street-registration.service'
import { RequestInspectionTemplateModule } from './aosh/request-inspection/request-inspection.module'
import { RequestInspectionTemplateService } from './aosh/request-inspection/request-inspection.service'
import { HealthInsuranceDeclarationModule } from './health-insurance-declaration/health-insurance-declaration.module'
import { HealthInsuranceDeclarationService } from './health-insurance-declaration/health-insurance-declaration.service'
import { NewPrimarySchoolModule } from './new-primary-school/new-primary-school.module'
import { NewPrimarySchoolService } from './new-primary-school/new-primary-school.service'
import { WorkAccidentNotificationTemplateModule } from './aosh/work-accident-notification/work-accident-notification.module'
import { WorkAccidentNotificationTemplateService } from './aosh/work-accident-notification/work-accident-notification.service'
import { IdCardModule } from './id-card/id-card.module'
import { IdCardService } from './id-card/id-card.service'
import { ParliamentaryListCreationModule } from './signature-collection/parliamentary-list-creation/parliamentary-list-creation.module'
import { ParliamentaryListCreationService } from './signature-collection/parliamentary-list-creation/parliamentary-list-creation.service'
import { ParliamentaryListSigningModule } from './signature-collection/parliamentary-list-signing/parliamentary-list-signing.module'
import { ParliamentaryListSigningService } from './signature-collection/parliamentary-list-signing/parliamentary-list-signing.service'
import { SeminarsTemplateService } from './aosh/seminars/seminars.service'
import { SeminarsTemplateModule } from './aosh/seminars/seminars.module'
import { MunicipalListCreationModule } from './signature-collection/municipal-list-creation/municipal-list-creation.module'
import { MunicipalListCreationService } from './signature-collection/municipal-list-creation/municipal-list-creation.service'
import { MunicipalListSigningModule } from './signature-collection/municipal-list-signing/municipal-list-signing.module'
import { MunicipalListSigningService } from './signature-collection/municipal-list-signing/municipal-list-signing.service'
import { SecondarySchoolModule } from './secondary-school/secondary-school.module'
import { SecondarySchoolService } from './secondary-school/secondary-school.service'
import { TrainingLicenseOnAWorkMachineTemplateModule } from './aosh/training-license-on-a-work-machine/training-license-on-a-work-machine.module'
import { TrainingLicenseOnAWorkMachineTemplateService } from './aosh/training-license-on-a-work-machine/training-license-on-a-work-machine.service'

export const dynamicModules = [GeneralPetitionModule]

export const modules = [
  ReferenceTemplateModule,
  ExampleCommonActionsModule,
  ExampleStateTransfersModule,
  ExampleInputsModule,
  ExampleNoInputsModule,
  ExamplePaymentActionsModule,
  GeneralFishingLicenseModule,
  DataProtectionComplaintModule,
  PublicDebtPaymentPlanTemplateModule,
  DocumentProviderOnboardingModule,
  InstitutionCollaborationModule,
  HealthInsuranceModule,
  ChildrenResidenceChangeModuleV2,
  LoginServiceModule,
  FundingGovernmentProjectsModule,
  DrivingLicenseSubmissionModule,
  AccidentNotificationModule,
  CriminalRecordSubmissionModule,
  PSignSubmissionModule,
  AnnouncementOfDeathModule,
  ComplaintsToAlthingiOmbudsmanTemplateModule,
  MortgageCertificateSubmissionModule,
  MarriageConditionsSubmissionModule,
  FinancialAidModule,
  DrivingSchoolConfirmationModule,
  PassportModule,
  OperatingLicenseModule,
  FinancialStatementCemeteryTemplateModule,
  FinancialStatementsInaoTemplateModule,
  FinancialStatementIndividualElectionModule,
  FinancialStatementPoliticalPartyTemplateModule,
  NoDebtCertificateModule,
  InheritanceReportModule,
  EstateTemplateModule,
  AnonymityInVehicleRegistryModule,
  ChangeCoOwnerOfVehicleModule,
  ChangeOperatorOfVehicleModule,
  DigitalTachographDriversCardModule,
  LicensePlateRenewalModule,
  OrderVehicleLicensePlateModule,
  OrderVehicleRegistrationCertificateModule,
  TransferOfVehicleOwnershipModule,
  PassportAnnulmentModule,
  EuropeanHealthInsuranceCardModule,
  DrivingLicenseBookUpdateInstructorModule,
  DrivingLearnersPermitModule,
  DrivingLicenseDuplicateModule,
  CarRecyclingModule,
  CitizenshipModule,
  EnergyFundsModule,
  HealthcareLicenseCertificateModule,
  HealthcareWorkPermitModule,
  SignatureListCreationModule,
  SignatureListSigningModule,
  TransferOfMachineOwnershipTemplateModule,
  HomeSupportModule,
  ChangeMachineSupervisorTemplateModule,
  UniversityModule,
  DeregisterMachineTemplateModule,
  RegisterNewMachineTemplateModule,
  GrindavikHousingBuyoutModule,
  RequestInspectionTemplateModule,
  OfficialJournalOfIcelandTemplateModule,
  StreetRegistrationTemplateModule,
  IdCardModule,
  HealthInsuranceDeclarationModule,
  NewPrimarySchoolModule,
  WorkAccidentNotificationTemplateModule,
  ParliamentaryListCreationModule,
  ParliamentaryListSigningModule,
  MunicipalListCreationModule,
  MunicipalListSigningModule,
  ParentalLeaveModule,
  SocialInsuranceAdministrationModule,
  SeminarsTemplateModule,
  SecondarySchoolModule,
  TrainingLicenseOnAWorkMachineTemplateModule,
  ExampleAuthDelegationModule,
]

export const services = [
  ReferenceTemplateService,
  ExampleCommonActionsService,
  ExampleStateTransfersService,
  ExampleInputsService,
  ExampleNoInputsService,
  ExamplePaymentActionsService,
  GeneralFishingLicenseService,
  DataProtectionComplaintService,
  PublicDebtPaymentPlanTemplateService,
  ParentalLeaveService,
  DocumentProviderOnboardingService,
  InstitutionCollaborationService,
  HealthInsuranceService,
  ChildrenResidenceChangeServiceV2,
  LoginServiceService,
  FundingGovernmentProjectsService,
  DrivingLicenseSubmissionService,
  AccidentNotificationService,
  GeneralPetitionService,
  CriminalRecordSubmissionService,
  PSignSubmissionService,
  AnnouncementOfDeathService,
  ComplaintsToAlthingiOmbudsmanTemplateService,
  MortgageCertificateSubmissionService,
  FinancialAidService,
  DrivingSchoolConfirmationService,
  PassportService,
  OperatingLicenseService,
  FinancialStatementCemeteryTemplateService,
  FinancialStatementsInaoTemplateService,
  FinancialStatementIndividualElectionService,
  FinancialStatementPoliticalPartyTemplateService,
  MarriageConditionsSubmissionService,
  NoDebtCertificateService,
  InheritanceReportService,
  EstateTemplateService,
  AnonymityInVehicleRegistryService,
  ChangeCoOwnerOfVehicleService,
  ChangeOperatorOfVehicleService,
  DigitalTachographDriversCardService,
  LicensePlateRenewalService,
  OrderVehicleLicensePlateService,
  OrderVehicleRegistrationCertificateService,
  TransferOfVehicleOwnershipService,
  PassportAnnulmentService,
  EuropeanHealthInsuranceCardService,
  DrivingLicenseBookUpdateInstructorService,
  DrivingLearnersPermitService,
  DrivingLicenseDuplicateService,
  SocialInsuranceAdministrationService,
  CarRecyclingService,
  CitizenshipService,
  EnergyFundsService,
  HealthcareLicenseCertificateService,
  HealthcareWorkPermitService,
  SignatureListCreationService,
  SignatureListSigningService,
  TransferOfMachineOwnershipTemplateService,
  HomeSupportService,
  ChangeMachineSupervisorTemplateService,
  UniversityService,
  DeregisterMachineTemplateService,
  RegisterNewMachineTemplateService,
  GrindavikHousingBuyoutService,
  RequestInspectionTemplateService,
  OfficialJournalOfIcelandTemaplateService,
  StreetRegistrationTemplateService,
  IdCardService,
  HealthInsuranceDeclarationService,
  NewPrimarySchoolService,
  WorkAccidentNotificationTemplateService,
  ParliamentaryListCreationService,
  ParliamentaryListSigningService,
  SeminarsTemplateService,
  MunicipalListCreationService,
  MunicipalListSigningService,
  SecondarySchoolService,
  TrainingLicenseOnAWorkMachineTemplateService,
  ExampleAuthDelegationService,
]

import { ReferenceTemplateModule } from './reference-template/reference-template.module'
import { ParentalLeaveModule } from './parental-leave/parental-leave.module'
import { DocumentProviderOnboardingModule } from './document-provider-onboarding/document-provider-onboarding.module'
import { InstitutionCollaborationModule } from './institution-collaboration/institution-collaboration.module'
import { HealthInsuranceModule } from './health-insurance/health-insurance.module'
import { ChildrenResidenceChangeModuleV2 } from './children-residence-change-v2/children-residence-change.module'
import { LoginServiceModule } from './login-service/login-service.module'
import { FundingGovernmentProjectsModule } from './funding-government-projects/funding-government-projects.module'
import { DrivingLicenseSubmissionModule } from './driving-license-submission/driving-license-submission.module'
import { AccidentNotificationModule } from './accident-notification/accident-notification.module'
import { PublicDebtPaymentPlanTemplateModule } from './public-debt-payment-plan/public-debt-payment-plan.module'
import { GeneralPetitionModule } from './general-petition/general-petition.module'
import { CriminalRecordSubmissionModule } from './criminal-record-submission/criminal-record-submission.module'
import { GeneralFishingLicenseModule } from './general-fishing-license/general-fishing-license.module'
import { DataProtectionComplaintModule } from './data-protection-complaint/data-protection-complaint.module'
import { PSignSubmissionModule } from './p-sign-submission/p-sign-submission.module'
import { AnnouncementOfDeathModule } from './announcement-of-death/announcement-of-death.module'
import { ExamplePaymentActionsModule } from './example-payment-actions/examplePaymentActions.module'
import { ComplaintsToAlthingiOmbudsmanTemplateModule } from './complaints-to-althingi-ombudsman/complaints-to-althingi-ombudsman.module'
import { MortgageCertificateSubmissionModule } from './mortgage-certificate-submission/mortgage-certificate-submission.module'
import { MarriageConditionsSubmissionModule } from './marriage-conditions-submission/marriage-conditions-submission.module'
import { MarriageConditionsSubmissionService } from './marriage-conditions-submission/marriage-conditions-submission.service'
import { FinancialAidModule } from './financial-aid/financial-aid.module'
import { DrivingSchoolConfirmationModule } from './driving-school-confirmation/driving-school-confirmation.module'
import { PassportModule } from './passport/passport.module'
import { OperatingLicenseModule } from './operating-license/operatingLicense.module'
import { ReferenceTemplateService } from './reference-template/reference-template.service'
import { ParentalLeaveService } from './parental-leave/parental-leave.service'
import { DocumentProviderOnboardingService } from './document-provider-onboarding/document-provider-onboarding.service'
import { InstitutionCollaborationService } from './institution-collaboration/institution-collaboration.service'
import { HealthInsuranceService } from './health-insurance/health-insurance.service'
import { ChildrenResidenceChangeServiceV2 } from './children-residence-change-v2/children-residence-change.service'
import { ChildrenResidenceChangeService } from './children-residence-change/children-residence-change.service'
import { ChildrenResidenceChangeModule } from './children-residence-change/children-residence-change.module'
import { LoginServiceService } from './login-service/login-service.service'
import { FundingGovernmentProjectsService } from './funding-government-projects/funding-government-projects.service'
import { DrivingLicenseSubmissionService } from './driving-license-submission/driving-license-submission.service'
import { AccidentNotificationService } from './accident-notification/accident-notification.service'
import { PublicDebtPaymentPlanTemplateService } from './public-debt-payment-plan/public-debt-payment-plan.service'
import { GeneralPetitionService } from './general-petition/general-petition.service'
import { CriminalRecordSubmissionService } from './criminal-record-submission/criminal-record-submission.service'
import { GeneralFishingLicenseService } from './general-fishing-license/general-fishing-license.service'
import { DataProtectionComplaintService } from './data-protection-complaint/data-protection-complaint.service'
import { PSignSubmissionService } from './p-sign-submission/p-sign-submission.service'
import { AnnouncementOfDeathService } from './announcement-of-death/announcement-of-death.service'
import { ExamplePaymentActionsService } from './example-payment-actions/examplePaymentActions.service'
import { ComplaintsToAlthingiOmbudsmanTemplateService } from './complaints-to-althingi-ombudsman/complaints-to-althingi-ombudsman.service'
import { MortgageCertificateSubmissionService } from './mortgage-certificate-submission/mortgage-certificate-submission.service'
import { FinancialAidService } from './financial-aid/financial-aid.service'
import { DrivingSchoolConfirmationService } from './driving-school-confirmation/driving-school-confirmation.service'
import { PassportService } from './passport/passport.service'
import { OperatingLicenseService } from './operating-license/operatingLicense.service'
import { FinancialStatementsInaoTemplateModule } from './financial-statements-inao/financial-statements-inao.module'
import { FinancialStatementsInaoTemplateService } from './financial-statements-inao/financial-statements-inao.service'
import { NoDebtCertificateModule } from './no-debt-certificate/no-debt-certificate.module'
import { NoDebtCertificateService } from './no-debt-certificate/no-debt-certificate.service'
import { InheritanceReportService } from './inheritance-report/inheritance-report.service'
import { InheritanceReportModule } from './inheritance-report/inheritance-report.module'
import { EstateTemplateModule } from './estate/estate.module'
import { EstateTemplateService } from './estate/estate.service'
import { PassportAnnulmentModule } from './passport-annulment/passport-annulment.module'
import { PassportAnnulmentService } from './passport-annulment/passport-annulment.service'

import { AnonymityInVehicleRegistryModule } from './transport-authority/anonymity-in-vehicle-registry/anonymity-in-vehicle-registry.module'
import { AnonymityInVehicleRegistryService } from './transport-authority/anonymity-in-vehicle-registry/anonymity-in-vehicle-registry.service'
import { ChangeCoOwnerOfVehicleModule } from './transport-authority/change-co-owner-of-vehicle/change-co-owner-of-vehicle.module'
import { ChangeCoOwnerOfVehicleService } from './transport-authority/change-co-owner-of-vehicle/change-co-owner-of-vehicle.service'
import { ChangeOperatorOfVehicleModule } from './transport-authority/change-operator-of-vehicle/change-operator-of-vehicle.module'
import { ChangeOperatorOfVehicleService } from './transport-authority/change-operator-of-vehicle/change-operator-of-vehicle.service'
import { DigitalTachographCompanyCardModule } from './transport-authority/digital-tachograph-company-card/digital-tachograph-company-card.module'
import { DigitalTachographCompanyCardService } from './transport-authority/digital-tachograph-company-card/digital-tachograph-company-card.service'
import { DigitalTachographDriversCardModule } from './transport-authority/digital-tachograph-drivers-card/digital-tachograph-drivers-card.module'
import { DigitalTachographDriversCardService } from './transport-authority/digital-tachograph-drivers-card/digital-tachograph-drivers-card.service'
import { DigitalTachographWorkshopCardModule } from './transport-authority/digital-tachograph-workshop-card/digital-tachograph-workshop-card.module'
import { DigitalTachographWorkshopCardService } from './transport-authority/digital-tachograph-workshop-card/digital-tachograph-workshop-card.service'
import { LicensePlateRenewalModule } from './transport-authority/license-plate-renewal/license-plate-renewal.module'
import { LicensePlateRenewalService } from './transport-authority/license-plate-renewal/license-plate-renewal.service'
import { OrderVehicleLicensePlateModule } from './transport-authority/order-vehicle-license-plate/order-vehicle-license-plate.module'
import { OrderVehicleLicensePlateService } from './transport-authority/order-vehicle-license-plate/order-vehicle-license-plate.service'
import { OrderVehicleRegistrationCertificateModule } from './transport-authority/order-vehicle-registration-certificate/order-vehicle-registration-certificate.module'
import { OrderVehicleRegistrationCertificateService } from './transport-authority/order-vehicle-registration-certificate/order-vehicle-registration-certificate.service'
import { TransferOfVehicleOwnershipModule } from './transport-authority/transfer-of-vehicle-ownership/transfer-of-vehicle-ownership.module'
import { TransferOfVehicleOwnershipService } from './transport-authority/transfer-of-vehicle-ownership/transfer-of-vehicle-ownership.service'
import {
  EuropeanHealthInsuranceCardModule,
  EuropeanHealthInsuranceCardService,
} from './european-health-insurance-card'
import { DrivingLicenseBookUpdateInstructorModule } from './driving-license-book-update-instructor/driving-license-book-update-instructor.module'
import { DrivingLicenseBookUpdateInstructorService } from './driving-license-book-update-instructor/driving-license-book-update-instructor.service'
import { DrivingLearnersPermitModule } from './driving-learners-permit/driving-learners-permit.module'
import { DrivingLearnersPermitService } from './driving-learners-permit/driving-learners-permit.service'
import { CitizenshipModule } from './directorate-of-immigration/citizenship/citizenship.module'
import { CitizenshipService } from './directorate-of-immigration/citizenship/citizenship.service'

import { EnergyFundsModule } from './energy-funds/energy-funds.module'
import { EnergyFundsService } from './energy-funds/energy-funds.service'

import { DrivingLicenseDuplicateModule } from './driving-license-duplicate/driving-license-duplicate.module'
import { DrivingLicenseDuplicateService } from './driving-license-duplicate/driving-license-duplicate.service'
import { SocialInsuranceAdministrationModule } from './social-insurance-administration/social-insurance-administration.module'
import { SocialInsuranceAdministrationService } from './social-insurance-administration/social-insurance-administration.service'

export const modules = [
  ReferenceTemplateModule,
  GeneralFishingLicenseModule,
  DataProtectionComplaintModule,
  PublicDebtPaymentPlanTemplateModule,
  ParentalLeaveModule,
  DocumentProviderOnboardingModule,
  InstitutionCollaborationModule,
  HealthInsuranceModule,
  ChildrenResidenceChangeModule,
  ChildrenResidenceChangeModuleV2,
  LoginServiceModule,
  FundingGovernmentProjectsModule,
  DrivingLicenseSubmissionModule,
  AccidentNotificationModule,
  GeneralPetitionModule,
  CriminalRecordSubmissionModule,
  GeneralFishingLicenseModule,
  DataProtectionComplaintModule,
  PSignSubmissionModule,
  AnnouncementOfDeathModule,
  ExamplePaymentActionsModule,
  ComplaintsToAlthingiOmbudsmanTemplateModule,
  MortgageCertificateSubmissionModule,
  MarriageConditionsSubmissionModule,
  FinancialAidModule,
  DrivingSchoolConfirmationModule,
  PassportModule,
  OperatingLicenseModule,
  FinancialStatementsInaoTemplateModule,
  NoDebtCertificateModule,
  InheritanceReportModule,
  EstateTemplateModule,
  AnonymityInVehicleRegistryModule,
  ChangeCoOwnerOfVehicleModule,
  ChangeOperatorOfVehicleModule,
  DigitalTachographCompanyCardModule,
  DigitalTachographDriversCardModule,
  DigitalTachographWorkshopCardModule,
  LicensePlateRenewalModule,
  OrderVehicleLicensePlateModule,
  OrderVehicleRegistrationCertificateModule,
  TransferOfVehicleOwnershipModule,
  EstateTemplateModule,
  PassportAnnulmentModule,
  EuropeanHealthInsuranceCardModule,
  DrivingLicenseBookUpdateInstructorModule,
  DrivingLearnersPermitModule,
  DrivingLicenseDuplicateModule,
  SocialInsuranceAdministrationModule,
  CitizenshipModule,
  EnergyFundsModule,
]

export const services = [
  ReferenceTemplateService,
  GeneralFishingLicenseService,
  DataProtectionComplaintService,
  PublicDebtPaymentPlanTemplateService,
  ParentalLeaveService,
  DocumentProviderOnboardingService,
  InstitutionCollaborationService,
  HealthInsuranceService,
  ChildrenResidenceChangeService,
  ChildrenResidenceChangeServiceV2,
  LoginServiceService,
  FundingGovernmentProjectsService,
  DrivingLicenseSubmissionService,
  AccidentNotificationService,
  GeneralPetitionService,
  CriminalRecordSubmissionService,
  GeneralFishingLicenseService,
  DataProtectionComplaintService,
  PSignSubmissionService,
  AnnouncementOfDeathService,
  ExamplePaymentActionsService,
  ComplaintsToAlthingiOmbudsmanTemplateService,
  MortgageCertificateSubmissionService,
  FinancialAidService,
  DrivingSchoolConfirmationService,
  PassportService,
  OperatingLicenseService,
  FinancialStatementsInaoTemplateService,
  MarriageConditionsSubmissionService,
  NoDebtCertificateService,
  InheritanceReportService,
  EstateTemplateService,
  AnonymityInVehicleRegistryService,
  ChangeCoOwnerOfVehicleService,
  ChangeOperatorOfVehicleService,
  DigitalTachographCompanyCardService,
  DigitalTachographDriversCardService,
  DigitalTachographWorkshopCardService,
  LicensePlateRenewalService,
  OrderVehicleLicensePlateService,
  OrderVehicleRegistrationCertificateService,
  TransferOfVehicleOwnershipService,
  EstateTemplateService,
  PassportAnnulmentService,
  EuropeanHealthInsuranceCardService,
  DrivingLicenseBookUpdateInstructorService,
  DrivingLearnersPermitService,
  DrivingLicenseDuplicateService,
  SocialInsuranceAdministrationService,
  CitizenshipService,
  EnergyFundsService,
]

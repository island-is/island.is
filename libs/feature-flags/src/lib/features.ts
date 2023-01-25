export enum Features {
  testing = 'do-not-remove-for-testing-only',
  // Integrate auth-api with user-profile-api.
  userProfileClaims = 'shouldAuthApiReturnUserProfileClaims',

  // Shows delegation picker in Identity Server and the Service Portal.
  delegationsEnabled = 'identityserverDelegationsEnabled',

  // Toggles the different kinds of delegations.
  customDelegations = 'isServicePortalAccessControlModuleEnabled',
  companyDelegations = 'identityserverCompanyDelegations',
  legalGuardianDelegations = 'identityserverLegalGuardianDelegations',
  personalRepresentativeDelegations = 'identityserverPersonalRepresentative',

  // Application visibility flags
  exampleApplication = 'isExampleApplicationEnabled',
  accidentNotification = 'isAccidentNotificationEnabled',
  announcementOfDeath = 'isAnnouncementOfDeathEnabled',
  noDebtCertificate = 'applicationTemplateNoDebtCertificateEnabled',
  drivingInstructorRegistrations = 'isDrivingInstructorRegistrationsEnabled',
  drivingSchoolConfirmations = 'isDrivingSchoolConfirmationsEnabled',
  passportApplication = 'isPassportApplicationEnabled',
  financialStatementInao = 'financialStatementInao',
  inheritanceReport = 'isInheritanceReportApplicationEnabled',
  operatingLicense = 'isApplicationOperatingLicenseEnabled',
  marriageConditions = 'isMarriageConditionsApplicationEnabled',
  estateApplication = 'isEstateApplicationEnabled',
  drivingLicenseDuplicate = 'isDrivingLicenseDuplicateEnabled',
  transportAuthorityAnonymityInVehicleRegistry = 'isTransportAuthorityAnonymityInVehicleRegistryEnabled',
  transportAuthorityChangeCoOwnerOfVehicle = 'isTransportAuthorityChangeCoOwnerOfVehicleEnabled',
  transportAuthorityChangeOperatorOfVehicle = 'isTransportAuthorityChangeOperatorOfVehicleEnabled',
  transportAuthorityDigitalTachographCompanyCard = 'isTransportAuthorityDigitalTachographCompanyCardEnabled',
  transportAuthorityDigitalTachographDriversCard = 'isTransportAuthorityDigitalTachographDriversCardEnabled',
  transportAuthorityDigitalTachographWorkshopCard = 'isTransportAuthorityDigitalTachographWorkshopCardEnabled',
  transportAuthorityOrderVehicleLicensePlate = 'isTransportAuthorityOrderVehicleLicensePlateEnabled',
  transportAuthorityOrderVehicleRegistrationCertificate = 'isTransportAuthorityOrderVehicleRegistrationCertificateEnabled',
  transportAuthorityTransferOfVehicleOwnership = 'isTransportAuthorityTransferOfVehicleOwnershipEnabled',

  // Application System Delegations active
  applicationSystemDelegations = 'applicationSystemDelegations',

  // Service portal modules
  servicePortalDocumentProviderModule = 'isServicePortalDocumentProviderModuleEnabled',
  servicePortalIcelandicNamesRegistryModule = 'isServicePortalIcelandicNamesRegistryModuleEnabled',
  servicePortalPetitionsModule = 'isServicePortalPetitionsModuleEnabled',
  servicePortalDrivingLessonsBookModule = 'isServicePortalDrivingLessonsBookModuleEnabled',

  // Application delegation flags
  applicationTemplatePublicDeptPaymentPlanAllowDelegation = 'applicationTemplatePublicDeptPaymentPlanAllowDelegation',
  transportAuthorityTransferOfVehicleOwnershipDelegations = 'applicationTransportAuthorityTransferOfVehicleOwnershipDelegations',
}

export enum ServerSideFeature {
  testing = 'do-not-remove-for-testing-only',
  drivingLicense = 'driving-license-use-v1-endpoint-for-v2-comms',
  delegationApi = 'delegation-api',
}

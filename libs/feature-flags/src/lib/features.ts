export enum Features {
  testing = 'do-not-remove-for-testing-only',
  // Integrate auth-api with user-profile-api.
  userProfileClaims = 'shouldAuthApiReturnUserProfileClaims',

  // Application visibility flags
  exampleApplication = 'isExampleApplicationEnabled',
  accidentNotification = 'isAccidentNotificationEnabled',
  europeanHealthInsuranceCard = 'isEuropeanHealthInsuranceCardApplicationEnabled',
  passportApplication = 'isPassportApplicationEnabled',
  financialStatementInao = 'financialStatementInao',
  inheritanceReport = 'isInheritanceReportApplicationEnabled',
  transportAuthorityDigitalTachographCompanyCard = 'isTransportAuthorityDigitalTachographCompanyCardEnabled',
  transportAuthorityDigitalTachographDriversCard = 'isTransportAuthorityDigitalTachographDriversCardEnabled',
  transportAuthorityDigitalTachographWorkshopCard = 'isTransportAuthorityDigitalTachographWorkshopCardEnabled',
  transportAuthorityLicensePlateRenewal = 'isTransportAuthorityLicensePlateRenewalEnabled',
  alcoholTaxRedemption = 'isAlcoholTaxRedemptionEnabled',
  consultationPortalApplication = 'isConsultationPortalEnabled',
  childrenResidenceChangeV2 = 'isChildrenResidenceChangeV2Enabled',
  citizenship = 'isCitizenshipEnabled',
  residencePermitPermanent = 'isResidencePermitPermanentEnabled',
  residencePermitRenewal = 'isResidencePermitRenewalEnabled',

  // Application System Delegations active
  applicationSystemDelegations = 'applicationSystemDelegations',

  // Service portal modules
  servicePortalPetitionsModule = 'isServicePortalPetitionsModuleEnabled',
  servicePortalConsentModule = 'isServicePortalConsentModuleEnabled',
  servicePortalHealthRightsModule = 'isServicePortalHealthRightsModuleEnabled',
  servicePortalSecondaryEducationPages = 'isServicePortalSecondaryEducationPageEnabled',
  servicePortalHealthCenterDentistPage = 'isServicePortalHealthCenterPageEnabled',
  servicePortalWorkMachinesModule = 'isServicePortalWorkMachinesPageEnabled',

  //License service new drivers license client enabled
  licenseServiceDrivingLicenseClient = 'isLicenseServiceDrivingLicenceClientV2Enabled',

  // Application delegation flags
  transportAuthorityLicensePlateRenewalDelegations = 'applicationTransportAuthorityLicensePlateRenewalDelegations',
  isFishingLicenceCustomDelegationEnabled = 'isFishingLicenceCustomDelegationEnabled',

  //Application system
  applicationSystemHistory = 'applicationSystemHistory',
}

export enum ServerSideFeature {
  testing = 'do-not-remove-for-testing-only',
  drivingLicense = 'driving-license-use-v1-endpoint-for-v2-comms',
}

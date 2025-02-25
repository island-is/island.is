export enum Features {
  testing = 'do-not-remove-for-testing-only',
  // Integrate auth-api with user-profile-api.
  userProfileClaims = 'shouldAuthApiReturnUserProfileClaims',
  shouldAuthIdsApiUseNationalRegistryV3 = 'shouldAuthIdsApiUseNationalRegistryV3',

  // Application visibility flags
  exampleApplication = 'isExampleApplicationEnabled',
  accidentNotification = 'isAccidentNotificationEnabled',
  europeanHealthInsuranceCard = 'isEuropeanHealthInsuranceCardApplicationEnabled',
  passportApplication = 'isPassportApplicationEnabled',
  passportAnnulmentApplication = 'isPassportAnnulmentApplicationEnabled',
  financialStatementInao = 'financialStatementInao',
  alcoholTaxRedemption = 'isAlcoholTaxRedemptionEnabled',
  consultationPortalApplication = 'isConsultationPortalEnabled',
  childrenResidenceChangeV2 = 'isChildrenResidenceChangeV2Enabled',
  complaintsToAlthingiOmbudsman = 'isComplaintToAlthingiOmbudsmanEnabled',
  university = 'isUniversityEnabled',
  homeSupport = 'isHomeSupportEnabled',
  grindavikHousingBuyout = 'isGrindavikHousingBuyoutEnabled',
  officialJournalOfIceland = 'isOfficialJournalOfIcelandEnabled',
  idCardApplication = 'isIdCardApplicationEnabled',
  HealthInsuranceDeclaration = 'isHealthInsuranceDeclarationEnabled',
  newPrimarySchool = 'isNewPrimarySchoolEnabled',
  FinancialStatementCemetery = 'isFinancialStatementCemeteryEnabled',
  ParliamentaryElectionApplication = 'isParliamentaryElectionApplicationEnabled',
  FinancialStatementIndividualElectionEnabled = 'isFinancialStatementIndividualElectionEnabled',
  deathBenefits = 'isdeathbenefitsapplicationenabled',
  FinancialStatementPoliticalPartyEnabled = 'isFinancialStatementPoliticalPartyEnabled',
  IncomePlanEnabled = 'isIncomePlanEnabled',
  SecondarySchoolEnabled = 'isSecondarySchoolEnabled',

  // Application System Delegations active
  applicationSystemDelegations = 'applicationSystemDelegations',

  // Service portal modules
  servicePortalConsentModule = 'isServicePortalConsentModuleEnabled',
  servicePortalSocialInsurancePageEnabled = 'isServicePortalSocialInsurancePageEnabled',
  servicePortalSocialInsuranceIncomePlanPageEnabled = 'isServicePortalSocialInsuranceIncomePlanPageEnabled',
  servicePortalHealthVaccinationsPageEnabled = 'isServicePortalHealthVaccinationsPageEnabled',
  servicePortalHealthOrganDonationPageEnabled = 'isServicePortalHealthOrganDonationPageEnabled',
  servicePortalHealthReferralsPageEnabled = 'isServicePortalReferralsPageEnabled',
  servicePortalHealthWaitlistsPageEnabled = 'isServicePortalHealthWaitlistsPageEnabled',
  servicePortalHealthMedicineLandlaeknirPageEnabled = 'isServicePortalHealthMedicineLandlaeknirPageEnabled',
  servicePortalDocumentsActionsEnabled = 'isServicePortalDocumentsActionsEnabled',
  isServicePortalDocumentsV3PageEnabled = 'isServicePortalDocumentsV3PageEnabled',
  //Occupational License Health directorate fetch enabled
  occupationalLicensesHealthDirectorate = 'isHealthDirectorateOccupationalLicenseEnabled',
  healthPaymentOverview = 'isHealthPaymentsDocumentOverviewEnabled',

  //Occupational License Health directorate fetch enabled
  occupationalLicensesV2 = 'isOccupationalLicensesV2Enabled',

  //New License service fetch enabled
  licensesV2 = 'isLicensesV2Enabled',
  pkPassV2 = 'isPkPassV2Enabled',

  //Is social administration payment plan 2025 enabled?
  isServicePortalPaymentPlan2025Enabled = 'isServicePortalPaymentPlan2025Enabled',

  //Is vehicle bulk mileage graph enabled?
  isServicePortalVehicleBulkMileageSubdataPageEnabled = 'isServicePortalVehicleBulkMileageSubdataPageEnabled',

  //Possible universities
  isUniversityOfAkureyriEnabled = 'isUniversityOfAkureyriEnabled',
  isAgriculturalUniversityOfIcelandEnabled = 'isAgriculturalUniversityOfIcelandEnabled',
  isBifrostUniversityEnabled = 'isBifrostUniversityEnabled',
  isHolarUniversityEnabled = 'isHolarUniversityEnabled',
  isIcelandUniversityOfTheArtsEnabled = 'isIcelandUniversityOfTheArtsEnabled',

  //License service new drivers license client enabled
  licenseServiceDrivingLicenseClient = 'isLicenseServiceDrivingLicenceClientV2Enabled',
  licenseServiceDrivingLicencePhotoCheckDisabled = 'isLicenseServiceDrivingLicencePhotoCheckDisabled',

  //Enable intellectual properties fetch
  isIntellectualPropertyModuleEnabled = 'isIntellectualPropertyModuleEnabled',

  // Application delegation flags
  isFishingLicenceCustomDelegationEnabled = 'isFishingLicenceCustomDelegationEnabled',

  //Application system
  applicationSystemHistory = 'applicationSystemHistory',

  // Search indexer
  shouldSearchIndexerResolveNestedEntries = 'shouldSearchIndexerResolveNestedEntries',

  // Userprofile Collection
  isIASSpaPagesEnabled = 'isiasspapagesenabled',

  // Disable new login restrictions
  disableNewDeviceLogins = 'disableNewDeviceLogins',

  // Notifications
  isNotificationEmailWorkerEnabled = 'isnotificationemailworkerenabled',

  // New/updated delegation notification
  isDelegationNotificationEnabled = 'isDelegationNotificationEnabled',

  shouldSendEmailNotificationsToDelegations = 'shouldSendEmailNotificationsToDelegations',

  // Single sign on passkeys
  isPasskeyRegistrationEnabled = 'isPasskeyRegistrationEnabled',
  isPasskeyAuthEnabled = 'isPasskeyAuthEnabled',

  // Should auth api use national registry v3 for checking deceased status
  isNationalRegistryV3DeceasedStatusEnabled = 'isNationalRegistryV3DeceasedStatusEnabled',
}

export enum ServerSideFeature {
  testing = 'do-not-remove-for-testing-only',
  drivingLicense = 'driving-license-use-v1-endpoint-for-v2-comms',
}

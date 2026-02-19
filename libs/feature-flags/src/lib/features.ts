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
  legalGazette = 'isLegalGazetteEnabled',
  HealthInsuranceDeclaration = 'isHealthInsuranceDeclarationEnabled',
  newPrimarySchool = 'isNewPrimarySchoolEnabled',
  FinancialStatementCemetery = 'isFinancialStatementCemeteryEnabled',
  ParliamentaryElectionApplication = 'isParliamentaryElectionApplicationEnabled',
  municipalElectionApplication = 'isMunicipalElectionApplicationEnabled',
  FinancialStatementIndividualElectionEnabled = 'isFinancialStatementIndividualElectionEnabled',
  deathBenefits = 'isdeathbenefitsapplicationenabled',
  FinancialStatementPoliticalPartyEnabled = 'isFinancialStatementPoliticalPartyEnabled',
  rentalAgreement = 'isRentalAgreementEnabled',
  medicalAndRehabilitationPayments = 'isMedicalAndRehabilitationPaymentsEnabled',
  disabilityPension = 'isDisabilityPensionEnabled',
  disabilityPensionLightweightModeEnabled = 'isDisabilityPensionLightweightModeEnabled',
  pensionSupplementEnabled = 'isPensionSupplementEnabled',
  fireCompensationAppraisalEnabled = 'isFireCompensationAppraisalEnabled',
  ExemptionForTransportation = 'isExemptionForTransportationEnabled',
  TerminateRentalAgreementEnabled = 'isterminaterentalagreementsenabled',
  UnemploymentBenefitsEnabled = 'isUnemploymentBenefitsEnabled',
  RegistrationOfNewPropertyNumbersEnabled = 'isRegistrationOfNewPropertyNumbersEnabled',
  fundingGovernmentProjectsEnabled = 'isFundingGovernmentProjectsEnabled',

  // Application System Delegations active
  applicationSystemDelegations = 'applicationSystemDelegations',

  // Service portal modules
  servicePortalHealthPatientPermitsPageEnabled = 'isServicePortalHealthPatientPermitsPageEnabled',
  servicePortalConsentModule = 'isServicePortalConsentModuleEnabled',
  servicePortalSocialInsurancePageEnabled = 'isServicePortalSocialInsurancePageEnabled',
  servicePortalSocialInsuranceIncomePlanPageEnabled = 'isServicePortalSocialInsuranceIncomePlanPageEnabled',
  servicePortalHealthReferralsPageEnabled = 'isServicePortalReferralsPageEnabled',
  servicePortalHealthWaitlistsPageEnabled = 'isServicePortalHealthWaitlistsPageEnabled',
  servicePortalHealthMedicineLandlaeknirPageEnabled = 'isServicePortalHealthMedicineLandlaeknirPageEnabled',
  servicePortalHealthMedicineDelegationPageEnabled = 'isServicePortalHealthMedicineDelegationPageEnabled',
  servicePortalHealthBloodPageEnabled = 'isServicePortalHealthBloodPageEnabled',
  isServicePortalMyContractsPageEnabled = 'isServicePortalMyContractsPageEnabled',
  servicePortalDocumentsActionsEnabled = 'isServicePortalDocumentsActionsEnabled',
  isServicePortalDocumentsV3PageEnabled = 'isServicePortalDocumentsV3PageEnabled',
  isServicePortal2WayMailboxEnabled = 'isServicePortal2WayMailboxEnabled',
  servicePortalPoliceCasesPageEnabled = 'isServicePortalPoliceCasesPageEnabled',
  isServicePortalHealthQuestionnairesPageEnabled = 'isServicePortalHealthQuestionnairesPageEnabled',
  // Health Aid and Nutrition Renewal feature enabled
  servicePortalHealthAidAndNutritionRenewalEnabled = 'isServicePortalHealthAidAndNutritionRenewalEnabled',
  //Occupational License Health directorate fetch enabled
  occupationalLicensesHealthDirectorate = 'isHealthDirectorateOccupationalLicenseEnabled',
  healthPaymentOverview = 'isHealthPaymentsDocumentOverviewEnabled',
  isIDSAdminSsoSettingEnabled = 'isIDSAdminSsoSettingEnabled',
  isIdentityDocumentEnabled = 'isIdentityDocumentEnabled',
  isServicePortalHealthAppointmentsPageEnabled = 'isServicePortalHealthAppointmentsPageEnabled',

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

  //License service license scanner disabled
  isLicenseScannerDisabled = 'isLicenseScannerDisabled',

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

  shouldSendEmailNotificationsToCompanyUserProfiles = 'shouldSendEmailNotificationsToCompanyUserProfiles',

  // Single sign on passkeys
  isPasskeyRegistrationEnabled = 'isPasskeyRegistrationEnabled',
  isPasskeyAuthEnabled = 'isPasskeyAuthEnabled',

  // Islandis Payment
  isIslandisPaymentEnabled = 'islandisPayment',
  useIslandisPaymentForApplicationSystem = 'useIslandisPaymentForApplicationSystem',
  isIslandisInvoicePaymentEnabled = 'isIslandisInvoicePaymentEnabled',
  isIslandisInvoicePaymentAllowedForUser = 'isislandisinvoicepaymentsallowedforuser',

  // Should auth api use national registry v3 for checking deceased status
  isNationalRegistryV3DeceasedStatusEnabled = 'isNationalRegistryV3DeceasedStatusEnabled',

  // Should applicaton-system use national registry v3
  shouldApplicationSystemUseNationalRegistryV3 = 'shouldApplicationSystemUseNationalRegistryV3',

  delegationTypesWithNotificationsEnabled = 'delegationTypesWithNotificationsEnabled',

  // Allow fake data
  digitalTachographDriversCardAllowFakeData = 'digitalTachographDriversCardAllowFakeData',

  isPortalAirDiscountPageDisabled = 'isPortalAirDiscountPageDisabled',

  isMileCarEnabled = 'isMileCarEnabled',
  isHHCourseApplicationEnabled = 'isHHCourseApplicationEnabled',

  // Use new vacancy API client (Financial Management Authority/Elfur) instead of old X-Road client
  useNewVacancyApi = 'useNewVacancyApi',
  // Questionnaires
  questionnairesFromEL = 'isQuestionnairesHealthDirectorateClientEnabled',
  questionnairesFromLSH = 'isQuestionnairesLshClientEnabled',

  // SMS Notifications
  isSmsNotificationEnabled = 'isSmsNotificationEnabled',
  isSendSmsNotificationsEnabled = 'isSendSmsNotificationsEnabled',
}

export enum ServerSideFeature {
  testing = 'do-not-remove-for-testing-only',
  drivingLicense = 'driving-license-use-v1-endpoint-for-v2-comms',
}

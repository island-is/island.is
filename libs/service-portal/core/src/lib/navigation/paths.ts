export enum ServicePortalPath {
  // Mínar síður
  MinarSidurRoot = '/',
  MinarSidurSignInOidc = '/signin-oidc',
  MinarSidurSilentSignInOidc = '/silent/signin-oidc',

  // Applications
  ApplicationRoot = '/umsoknir',
  ApplicationNewApplication = '/umsoknir/ny-umsokn',
  ApplicationOpenApplications = '/umsoknir/opnar-umsoknir',
  ApplicationPrescription = '/umsoknir/lyfsedlar',
  ApplicationDrivingLicense = '/umsoknir/okuskirteini',

  // Settings
  SettingsRoot = '/stillingar',

  SettingsAccessControl = '/stillingar/adgangsstyring',
  SettingsAccessControlGrant = '/stillingar/adgangsstyring/veita',
  SettingsAccessControlAccess = '/stillingar/adgangsstyring/:nationalId(\\d+)',
  SettingsPersonalInformation = '/stillingar/personuupplysingar',
  SettingsPersonalInformationEditPhoneNumber = '/stillingar/personuupplysingar/breyta-simanumeri',
  SettingsPersonalInformationEditEmail = '/stillingar/personuupplysingar/breyta-netfangi',
  SettingsPersonalInformationEditLanguage = '/stillingar/personuupplysingar/breyta-tungumali',
  SettingsPersonalInformationEmailConfirmation = '/stillingar/personuupplysingar/stadfesta-netfang/:hash',
  SettingsExternal = 'https://minarsidur.island.is/minar-sidur/minn-adgangur/stillingar/',
  SettingsIslykill = '/stillingar/islykill',

  // Family
  FamilyRoot = '/min-gogn/fjolskyldan',
  FamilyMember = '/min-gogn/fjolskyldan/:nationalId',
  MyInfoRoot = '/min-gogn',
  UserInfo = '/min-gogn/minar-upplysingar',
  Endorsements = '/min-gogn/medmaeli',

  // General Petitions
  Petitions = '/min-gogn/medmaeli',
  PetitionsAdminView = '/min-gogn/medmaeli-admin',
  PetitionList = '/min-gogn/medmaeli/:listId',
  PetitionListAdmin = '/min-gogn/medmaeli-admin/:listId',

  RealEstateExternal = 'https://minarsidur.island.is/minar-sidur/min-gogn/fasteignir',

  // Fjarmal
  FinanceRoot = '/fjarmal',
  FinanceStatus = '/fjarmal/stada',
  FinanceTransactions = '/fjarmal/faerslur',
  FinanceEmployeeClaims = '/fjarmal/laungreidendakrofur',
  FinanceLocalTax = '/fjarmal/utsvar',
  FinanceBills = '/fjarmal/greidslusedlar-og-greidslukvittanir',
  FinanceVehicles = 'https://mitt.samgongustofa.is/',
  FinancePayments = '/greidslur',
  FinanceExternal = 'https://minarsidur.island.is/minar-sidur/fjarmal/fjarmal-stada-vid-rikissjod-og-stofnanir/',

  // Electronic Documents
  ElectronicDocumentsRoot = '/postholf',
  ElectronicDocumentsFileDownload = '/postholf/:id',

  // Heilsa
  HealthRoot = '/heilsa',

  // Education
  EducationRoot = '/menntun',
  EducationDegree = '/menntun/profgradur',
  EducationCareer = '/menntun/namsferill',
  EducationStudentAssessment = '/menntun/namsferill/:familyIndex/samraemd-prof',
  EducationExternal = 'https://minarsidur.island.is/minar-sidur/menntun/namsferill/',

  // Education License
  EducationLicense = '/leyfisbref',

  // Assets
  AssetsRoot = '/fasteignir',
  AssetsVehicles = '/okutaeki',

  // Messages
  MessagesRoot = '/skilabod',

  // My licenses
  MyLicensesRoot = '/min-rettindi',
  ParentalLeave = '/min-rettindi/faedingarorlof',
  DrivingLicense = '/min-rettindi/okuskirteini',

  // Icelandic Names Registry
  IcelandicNamesRegistryRoot = '/mannanafnaskra',

  // Licenses service
  LicensesRoot = '/min-gogn/skilriki',

  // DocumentProvider
  // Temporary change to the value of DocumentProviderRoot; skjalaveita -> skjalaveitur. In the first
  // release there will only be a limited number of features and this change creates a better UX in
  // that scenario.
  DocumentProviderRoot = '/skjalaveitur', // Breytt path
  DocumentProviderDocumentProvidersSingle = '/skjalaveitur/:nationalId',
  // DocumentProviderDocumentProviders = '/skjalaveita/skjalaveitendur',
  // DocumentProviderMyCategories = '/skjalaveita/minir-flokkar',
  // DocumentProviderSettingsRoot = '/skjalaveita/skjalaveita-stillingar',
  // DocumentProviderSettingsEditInstituion = '/skjalaveita/skjalaveita-stillingar/breyta-stofnun',
  // DocumentProviderSettingsEditResponsibleContact = '/skjalaveita/skjalaveita-stillingar/breyta-abyrgdarmanni',
  // DocumentProviderSettingsEditTechnicalContact = '/skjalaveita/skjalaveita-stillingar/breyta-taeknilegum-tengilid',
  // DocumentProviderSettingsEditUserHelpContact = '/skjalaveita/skjalaveita-stillingar/breyta-notendaadstod',
  // DocumentProviderSettingsEditEndpoints = '/skjalaveita/skjalaveita-stillingar/breyta-endapunkt',
  // DocumentProviderTechnicalInfo = '/skjalaveita/taeknilegar-upplysingar',
  // DocumentProviderStatistics = '/skjalaveita/tolfraedi',
}

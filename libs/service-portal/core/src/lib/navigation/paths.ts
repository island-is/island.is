export enum ServicePortalPath {
  // Mínar síður
  MinarSidurRoot = '/',
  MinarSidurPath = '/minarsidur',
  MinarSidurSignInOidc = '/signin-oidc',
  MinarSidurSilentSignInOidc = '/silent/signin-oidc',

  // Applications
  ApplicationRoot = '/umsoknir',
  ApplicationIncompleteApplications = '/umsoknir/oklaradar-umsoknir',
  ApplicationCompleteApplications = '/umsoknir/klaradar-umsoknir',
  ApplicationInProgressApplications = '/umsoknir/i-vinnslu',
  ApplicationNewApplication = '/umsoknir/ny-umsokn',
  ApplicationOpenApplications = '/umsoknir/opnar-umsoknir',
  ApplicationPrescription = '/umsoknir/lyfsedlar',
  ApplicationDrivingLicense = '/umsoknir/okuskirteini',

  // Settings
  SettingsRoot = '/stillingar',
  SettingsAccessControl = '/stillingar/adgangsstyring',
  SettingsAccessControlGrant = '/stillingar/adgangsstyring/veita',
  SettingsAccessControlAccess = '/stillingar/adgangsstyring/:delegationId',

  // Access Control
  AccessControlDelegationsGrant = '/adgangsstyring/umbod/veita',
  // Access Control - Outgoing delegations, i.e. from me
  AccessControlDelegations = '/adgangsstyring/umbod',
  AccessControlDelegationAccess = '/adgangsstyring/umbod/:delegationId',
  // Access Control - Incoming delegations, i.e. to me
  AccessControlDelegationsIncoming = '/adgangsstyring/umbod-til-min',

  SettingsPersonalInformation = '/stillingar/minar-stillingar',
  SettingsPersonalInformationEditPhoneNumber = '/stillingar/minar-stillingar/breyta-simanumeri',
  SettingsPersonalInformationEditEmail = '/stillingar/minar-stillingar/breyta-netfangi',
  SettingsPersonalInformationEditLanguage = '/stillingar/minar-stillingar/breyta-tungumali',
  SettingsPersonalInformationEditNudge = '/stillingar/minar-stillingar/breyta-hnippi',
  SettingsPersonalInformationEditBankInfo = '/stillingar/minar-stillingar/reikningsnumer',
  SettingsPersonalInformationEmailConfirmation = '/stillingar/minar-stillingar/stadfesta-netfang/:hash',
  SettingsExternal = 'https://minarsidur.island.is/minar-sidur/minn-adgangur/stillingar/',
  SettingsIslykill = '/stillingar/islykill',

  // Family
  Child = '/min-gogn/yfirlit/barn/:nationalId',
  FamilyMember = '/min-gogn/yfirlit/:nationalId',
  Spouse = '/min-gogn/yfirlit/maki/:nationalId',
  MyInfoRoot = '/min-gogn',
  MyInfoRootOverview = '/min-gogn/yfirlit',
  UserInfo = '/min-gogn/yfirlit/minar-upplysingar',
  Company = '/fyrirtaeki',

  // General Petitions
  Petitions = '/min-gogn/listar',
  PetitionList = '/min-gogn/listar/:listId',
  PetitionListOwned = '/min-gogn/listar/minn-listi/:listId',

  PetitionsAdminView = '/min-gogn/listar-admin',
  PetitionListAdmin = '/min-gogn/listar-admin/:listId',

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
  FinanceSchedule = '/fjarmal/greidsluaetlanir',
  // Electronic Documents
  ElectronicDocumentsRoot = '/postholf',
  ElectronicDocumentsFileDownload = '/postholf/:id',

  // Heilsa
  HealthRoot = '/heilsa',
  HealthTherapies = '/heilsa/thjalfun',
  HealthAidsAndNutrition = '/heilsa/hjalpartaeki-og-naering',

  // Education
  EducationRoot = '/menntun',
  EducationDegree = '/menntun/profgradur',
  EducationCareer = '/menntun/namsferill',
  EducationStudentAssessment = '/menntun/namsferill/:familyIndex/samraemd-prof',
  EducationExternal = 'https://minarsidur.island.is/minar-sidur/menntun/namsferill/',
  EducationHaskoliGraduation = '/menntun/haskoli/brautskraning',
  EducationHaskoliGraduationDetail = '/menntun/haskoli/brautskraning/:id',

  // Education License
  EducationLicense = '/leyfisbref',

  // Occupational Licenses
  OccupationalLicenses = '/starfsleyfi',
  OccupationalLicensesDetail = '/starfsleyfi/:id',

  // Assets
  AssetsRoot = '/fasteignir',
  AssetsRealEstateDetail = '/fasteignir/:id',
  AssetsVehicles = '/okutaeki',
  AssetsMyVehicles = '/okutaeki/min-okutaeki',
  AssetsVehiclesDetail = '/okutaeki/min-okutaeki/:id',
  AssetsVehiclesLookup = '/okutaeki/leit',
  AssetsVehiclesHistory = '/okutaeki/okutaekjaferill',
  AssetsVehiclesDrivingLessons = '/okutaeki/okunam',
  AssetsWorkMachines = '/okutaeki/vinnuvelar',
  AssetsWorkMachinesDetail = '/okutaeki/vinnuvelar/:regNumber/:id',

  // Messages
  MessagesRoot = '/skilabod',

  // My licenses
  MyLicensesRoot = '/min-rettindi',
  ParentalLeave = '/min-rettindi/faedingarorlof',

  // Icelandic Names Registry
  IcelandicNamesRegistryRoot = '/mannanafnaskra',

  // Licenses service
  LicensesRoot = '/skirteini',
  LicensesPassportDetail = '/skirteini/tjodskra/vegabref/:id',
  LicensesDetail = '/skirteini/:provider/:type',

  // Air Discount
  AirDiscountRoot = '/loftbru',
}

export enum ServicePortalPath {
  // Mínar síður
  MinarSidurRoot = '/',
  MinarSidurSignInOidc = '/signin-oidc',
  MinarSidurSilentSignInOidc = '/silent/signin-oidc',

  // Applications
  ApplicationRoot = '/umsoknir',
  ApplicationIntroduction = '/umsoknir-kynning',
  ApplicationNewApplication = '/umsoknir/ny-umsokn',
  ApplicationOpenApplications = '/umsoknir/opnar-umsoknir',
  ApplicationPrescription = '/umsoknir/lyfsedlar',
  ApplicationDrivingLicense = '/umsoknir/okuskirteini',

  // Settings
  SettingsRoot = '/stillingar',

  // Family
  FamilyRoot = '/fjolskyldan',
  FamilyMember = '/fjolskyldan/:nationalId',
  MyInfoRoot = '/min-gogn',
  UserInfo = '/min-gogn/minar-upplysingar',
  RealEstateExternal = 'https://minarsidur.island.is/minar-sidur/min-gogn/fasteignir',

  // Fjarmal
  FinanceRoot = '/fjarmal',
  FinanceVehicles = 'https://mitt.samgongustofa.is/',
  FinancePayments = '/greidslur',
  FinanceExternal = 'https://minarsidur.island.is/minar-sidur/fjarmal/fjarmal-stada-vid-rikissjod-og-stofnanir/',

  // Electronic Documents
  ElectronicDocumentsRoot = '/rafraen-skjol',

  // Heilsa
  HealthRoot = '/heilsa',

  // Education
  EducationRoot = '/menntun',
  EducationExternal = 'https://minarsidur.island.is/minar-sidur/menntun/namsferill/',

  // Assets
  AssetsRoot = '/eignir',

  // Messages
  MessagesRoot = '/skilabod',

  // My licenses
  MyLicensesRoot = '/min-rettindi',
  ParentalLeave = '/min-rettindi/faedingarorlof',
  DrivingLicense = '/min-rettindi/okuskirteini',

  // User Profile
  UserProfileRoot = '/stillingar/minn-adgangur',
  UserProfileEditPhoneNumber = '/stillingar/minn-adgangur/breyta-simanumeri',
  UserProfileEditEmail = '/stillingar/minn-adgangur/breyta-netfangi',
  UserProfileEditLanguage = '/stillingar/minn-adgangur/breyta-tungumali',
  UserProfileEmailConfirmation = '/stillingar/minn-adgangur/stadfesta-netfang/:hash',

  // Skjalaveita
  DocumentProviderRoot = '/skjalaveita',
}

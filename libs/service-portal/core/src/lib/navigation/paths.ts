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
  // Settings
  SettingsRoot = '/stillingar',
  // Family
  FamilyRoot = '/fjolskyldan',
  FamilyMember = '/fjolskyldan/:nationalId',
  MyInfoRoot = '/min-gogn',
  UserInfo = '/min-gogn/minar-upplysingar',
  // Fjarmal
  FinanceRoot = '/fjarmal',
  FinanceVehicles = 'https://mitt.samgongustofa.is/',
  FinancePayments = '/greidslur',
  // Electronic Documents
  ElectronicDocumentsRoot = '/rafraen-skjol',
  // Heilsa
  HealthRoot = '/heilsa',
  HealthHeilsuvera = 'https://minarsidur.heilsuvera.is/heimasvaedi',
  HealthVaccinations = 'https://minarsidur.heilsuvera.is/bolusetningar/bolusett-gegn/',
  // Education
  EducationRoot = '/menntun',
  // Assets
  AssetsRoot = '/eignir',
  // Messages
  MessagesRoot = '/skilabod',
  // My licenses
  MyLicensesRoot = '/min-rettindi',

  // User Profile
  UserProfileRoot = '/stillingar/minn-adgangur',
  UserProfileEditPhoneNumber = '/stillingar/minn-adgangur/breyta-simanumeri',
  UserProfileEditEmail = '/stillingar/minn-adgangur/breyta-netfangi',
  UserProfileEditLanguage = '/stillingar/minn-adgangur/breyta-tungumali',
  UserProfileEmailConfirmation = '/stillingar/minn-adgangur/stadfesta-netfang/:hash',

  // Skjalaveita
  DocumentProviderRoot = '/skjalaveita',
  DocumentProviderDocumentProviders = '/skjalaveita/skjalaveitendur',
  DocumentProviderMyCategories = '/skjalaveita/minir-flokkar',
  DocumentProviderSettingsRoot = '/skjalaveita/skjalaveita-stillingar',
  DocumentProviderSettingsEditInstituion = '/skjalaveita/skjalaveita-stillingar/breyta-stofnun',
  DocumentProviderSettingsEditResponsibleContact = '/skjalaveita/skjalaveita-stillingar/breyta-abyrgdarmanni',
  DocumentProviderSettingsEditTechnicalContact = '/skjalaveita/skjalaveita-stillingar/breyta-taeknilegum-tengilid',
  DocumentProviderSettingsEditUserHelpContact = '/skjalaveita/skjalaveita-stillingar/breyta-notendaadstod',
  DocumentProviderSettingsEditEndpoints = '/skjalaveita/skjalaveita-stillingar/breyta-endapunkt',
  DocumentProviderTechnicalInfo = '/skjalaveita/taeknilegar-upplysingar',
}

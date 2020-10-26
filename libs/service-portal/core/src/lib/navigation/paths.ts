export enum ServicePortalPath {
  // Mínar síður
  MinarSidurRoot = '/',
  MinarSidurSignInOidc = '/signin-oidc',
  MinarSidurSilentSignInOidc = '/silent/signin-oidc',
  // Umsoknir
  UmsoknirRoot = '/umsoknir',
  UmsoknirKynning = '/umsoknir-kynning',
  UmsoknirNyUmsokn = '/umsoknir/ny-umsokn',
  UmsoknirOpnarUmsoknir = '/umsoknir/opnar-umsoknir',
  UmsoknirLyfsedlar = '/umsoknir/lyfsedlar',
  // Stillingar
  StillingarRoot = '/stillingar',
  StillingarUmbod = '/min-rettindi',
  // Fjolskyldan
  FamilyRoot = '/fjolskyldan',
  MinGognRoot = '/min-gogn',
  UserInfo = '/min-gogn/minar-upplysingar',
  // Fjarmal
  FjarmalRoot = '/fjarmal',
  FjarmalOkutaeki = 'https://mitt.samgongustofa.is/',
  FjarmalGreidslur = '/greidslur',
  // Rafræn skjöl
  RafraenSkjolRoot = '/rafraen-skjol',
  // Heilsa
  HeilsaRoot = '/heilsa',
  HeilsaHeilsuvera = 'https://minarsidur.heilsuvera.is/heimasvaedi',
  HeilsaBolusetningar = 'https://minarsidur.heilsuvera.is/bolusetningar/bolusett-gegn/',
  // Menntun
  MenntunRoot = '/menntun',
  // Eignir
  EignirRoot = '/eignir',
  // Skilabod
  SkilabodRoot = '/skilabod',

  // User Profile
  UserProfileRoot = '/stillingar/minn-adgangur',
  UserProfileEditPhoneNumber = '/stillingar/minn-adgangur/breyta-simanumeri',
  UserProfileEditEmail = '/stillingar/minn-adgangur/breyta-netfangi',
  UserProfileEditLanguage = '/stillingar/minn-adgangur/breyta-tungumali',
}

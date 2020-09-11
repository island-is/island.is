export enum ServicePortalPath {
  // Mínar síður
  MinarSidurRoot = '/',
  MinarSidurSignInOidc = '/signin-oidc',
  MinarSidurSilentSignInOidc = '/silent/signin-oidc',
  // Umsoknir
  UmsoknirRoot = '/umsoknir',
  UmsoknirNyUmsokn = '/umsoknir/ny-umsokn',
  UmsoknirOpnarUmsoknir = '/umsoknir/opnar-umsoknir',
  UmsoknirLyfsedlar = '/umsoknir/lyfsedlar',
  JudicialCreateDetentionPoc = '/stofna-krofu',
  JudicialDetentionRequestsPoc = '/gaesluvardhaldskrofur',
  // Stillingar
  StillingarRoot = '/stillingar',
  StillingarUpplysingar = '/stillingar/upplysingar',
  StillingarUmbod = '/stillingar/umbod',
  // Fjolskyldan
  FjolskyldanRoot = '/fjolskyldan',
  // Fjarmal
  FjarmalRoot = '/fjarmal',
  FjarmalOkutaeki = 'https://mitt.samgongustofa.is/',
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
}

export enum DataProviderTypes {
  NationalRegistry = 'NationalRegistryProvider',
  UserProfile = 'UserProfileProvider',
  IdentityRegistry = 'IdentityProvider',
}

export enum FishingLicenseEnum {
  HOOKCATCHLIMIT = 'hookCatchLimit',
  DRAGNOTEFISHING = 'dragNoteFishing',//TODO naming - Dragnótaveiðileyfi
  GREYSLEPP = 'greyslepp', // TODO naming -  Grásleppuveiðileyfi
  NORTHICEOCEANCOD = 'northIceOceanCod', // TODO naming - Norðuríshafsþorskveiðileyfi í norskri lögsögu
  CATCHLIMIT = 'catchMark',
  REDTUMMY = 'redTummy', // TODO naming - Rauðmagaveiðileyfi
  BEACHFISHING = 'beachFishing', // TODO naming - Strandveiðileyfi
  FREETIME = 'freetime', // TODO naming - Frístundaveiðar án aflaheimilda
  FREETIMEHOOK = 'freetimeHook', // TODO naming Frístundaveiðar með aflamarki
  FREETIMEHOOKMED = 'freetimeHookMed', // Frístundaveiðileyfi með aflaheimild
  BAITKINGFISHING = 'baitKingFishing', // TODO naming- Beitukóngsveiðileyfi
  COWFISH = 'cowfish', // TODO naming - Kúfiskveiðileyfi
  CRABFISHING = 'crabFishing', // TODO naming - Krabbaveiðileyfi
}
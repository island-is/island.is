export enum FishingLicenseEnum {
  HOOKCATCHLIMIT = 'hookCatchLimit',
  FISHWITHDANISHSEINE = 'fishWithDanishSeine', // Dragnótaveiðileyfi

  GREYSLEPP = 'greyslepp', // TODO naming -  Grásleppuveiðileyfi
  NORTHICEOCEANCOD = 'northIceOceanCod', // TODO naming - Norðuríshafsþorskveiðileyfi í norskri lögsögu

  CATCHLIMIT = 'catchMark',
  LUMPFISH = 'lumpfish', // Rauðmagaveiðileyfi
  COSTALFISHERIES = 'costalFisheries', // Strandveiðileyfi

  FREETIME = 'freetime', // TODO naming - Frístundaveiðar án aflaheimilda
  FREETIMEHOOK = 'freetimeHook', // TODO naming Frístundaveiðar með aflamarki
  FREETIMEHOOKMED = 'freetimeHookMed', // TODO Frístundaveiðileyfi með aflaheimild

  COMMONWHELK = 'commonWhelk', // Beitukóngsveiðileyfi
  OCEANQUAHOGIN = 'oceanQuahogin', // Kúfiskveiðileyfi
  CRUSTACEANS = 'crustaceans', // Krabbaveiðileyfi

  URCHIN = 'urchin', // Ígulkerjaveiðileyfi

  UNKNOWN = 'unknown', // Unknown, signals error
}

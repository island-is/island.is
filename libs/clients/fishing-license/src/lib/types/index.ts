// Haffæri
export type Seaworthiness = {
  validTo: Date
}

//Sviptingar
export type Deprivation = {
  validFrom: Date
  invalidFrom: Date
  explanation: string
}

export type Ship = {
  name: string
  registrationNumber: number // skipaskrárnúmer
  features: string //einkenni
  grossTons: number
  length: number
  homePort: string
  seaworthiness: Seaworthiness
  deprivations: Deprivation[]
  fishingLicenses: FishingLicenseInfo[]
}

export type FishingLicense = {
  fishingLicenseInfo: FishingLicenseInfo
  answer: boolean //todo should this be named answer
  reasons: FishingLicenseReason[]
}

export type FishingLicenseReason = {
  description: string
  directions: string // leidbeiningar?
}

export type FishingLicenseInfo = {
  code: FishingLicenseCodeType
  name: string
  chargeType: string
}

export enum FishingLicenseCodeType {
  catchMark = '1', // Almennt krókaflamarksveiðileyfi
  fishWithDanishSeine = '8', // Dragnótaveiðileyfi
  urchin = '7', // Ígulkeraveiðileyfi

  greyslepp = '11', // TODO naming -  Grásleppuveiðileyfi
  northIceOceanCod = '25', // TODO naming - Norðuríshafsþorskveiðileyfi í norskri lögsögu

  hookCatchLimit = '32', // Almennt aflamarksveiðileyfi
  lumpfish = '36', // Rauðmagaveiðileyfi
  costalFisheries = '37', // Strandveiðileyfi

  freetime = '38', // TODO naming - Frístundaveiðar án aflaheimilda
  freetimeHook = '42', // TODO naming - Frístundaveiðar með aflamarki
  freetimeHookMed = '39', // TODO naming - Frístundaveiðileyfi með aflaheimild

  commonWhelk = '50', // Beitukóngsveiðileyfi
  oceanQuahogin = '52', // Kúfiskveiðileyfi
  crustaceans = '54', // Krabbaveiðileyfi

  unknown = '0',
}

// Maps lexical liscense name to license code
export const mapFishingLicenseToCode = (license: string) => {
  switch (license) {
    case 'hookCatchLimit':
      return FishingLicenseCodeType.hookCatchLimit
    case 'fishWithDanishSeine':
      return FishingLicenseCodeType.fishWithDanishSeine
    case 'greyslepp':
      return FishingLicenseCodeType.greyslepp
    case 'northIceOceanCod':
      return FishingLicenseCodeType.northIceOceanCod
    case 'catchMark':
      return FishingLicenseCodeType.catchMark
    case 'lumpfish':
      return FishingLicenseCodeType.lumpfish
    case 'costalFisheries':
      return FishingLicenseCodeType.costalFisheries
    case 'freetime':
      return FishingLicenseCodeType.freetime
    case 'freetimeHook':
      return FishingLicenseCodeType.freetimeHook
    case 'freetimeHookMed':
      return FishingLicenseCodeType.freetimeHookMed
    case 'commonWhelk':
      return FishingLicenseCodeType.commonWhelk
    case 'oceanQuahogin':
      return FishingLicenseCodeType.oceanQuahogin
    case 'crustaceans':
      return FishingLicenseCodeType.crustaceans
    case 'urchin':
      return FishingLicenseCodeType.urchin
    default:
      return FishingLicenseCodeType.unknown
  }
}

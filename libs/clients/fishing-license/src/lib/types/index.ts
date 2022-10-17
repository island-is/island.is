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
  hookCatchLimit = '1', // Almennt aflamarksveiðileyfi
  fishWithDanishSeine = '8', // Dragnótaveiðileyfi
  
  greyslepp = '11', // TODO naming -  Grásleppuveiðileyfi
  northIceOceanCod = '25', // TODO naming - Norðuríshafsþorskveiðileyfi í norskri lögsögu

  catchMark = '32', // Almennt krókaflamarksveiðileyfi
  lumpfish = '36', // Rauðmagaveiðileyfi
  costalFisheries = '37', // Strandveiðileyfi

  freetime = '38', // TODO naming - Frístundaveiðar án aflaheimilda
  freetimeHook = '42', // TODO naming - Frístundaveiðar með aflamarki
  freetimeHookMed = 'MED', // TODO naming - Frístundaveiðileyfi með aflaheimild

  commonWhelk = '50', // Beitukóngsveiðileyfi
  oceanQuahogin = '52', // Kúfiskveiðileyfi
  crustaceans = '54', // Krabbaveiðileyfi
  unknown = '0',
}

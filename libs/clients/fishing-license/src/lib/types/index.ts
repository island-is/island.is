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
  dragNoteFishing = '8', //TODO naming - Dragnótaveiðileyfi
  greyslepp = '11', // TODO naming -  Grásleppuveiðileyfi
  northIceOceanCod = '25', // TODO naming - Norðuríshafsþorskveiðileyfi í norskri lögsögu
  catchMark = '32', // Almennt krókaflamarksveiðileyfi
  redTummy = '36', // TODO naming - Rauðmagaveiðileyfi
  beachFishing = '37', // TODO naming - Strandveiðileyfi
  freetime = '38', // TODO naming - Frístundaveiðar án aflaheimilda
  freetimeHook = '42', // TODO naming Frístundaveiðar með aflamarki
  freetimeHookMed = 'MED', // Frístundaveiðileyfi með aflaheimild
  baitKingFishing = '50', // TODO naming- Beitukóngsveiðileyfi
  cowfish = '52', // TODO naming - Kúfiskveiðileyfi
  crabFishing = '54', // TODO naming - Krabbaveiðileyfi
  unknown = '0',
}

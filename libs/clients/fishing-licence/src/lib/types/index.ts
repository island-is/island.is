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
  fishingLicences: string[]
}

export type FishingLicence = {
  name: string
  answer: true //todo should this be named answer
  reasons: FishingLicenceReason[]
}

export type FishingLicenceReason = {
  description: string
  directions: string // leidbeiningar?
}

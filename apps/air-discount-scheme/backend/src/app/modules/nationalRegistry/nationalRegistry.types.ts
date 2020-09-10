export interface NationalRegistryGeneralLookupResponse {
  source: 'Þjóðskrá' | 'Fyrirtækjaskrá'
  ssn: string
  name: string
  gender: 'kk' | 'kvk'
  address: string
  postalcode: number
  city: string
  lastmodified: string
  charged: boolean
  error?: string
}

export type FamilyMember = {
  banlabel?: string
  ssn: string
  gender: 1 | 2 | 3 | 4
  name: string
  address: string
  towncode: number
  postalcode: number
  city: string
}

export interface NationalRegistryFamilyLookupResponse {
  source: 'Þjóðskrá' | 'Fyrirtækjaskrá'
  familyssn: string
  results: FamilyMember[]
  error?: string
}

export interface NationalRegistryUser {
  nationalId: string
  firstName: string
  middleName: string
  lastName: string
  gender: 'kk' | 'kvk'
  address: string
  postalcode: number
  city: string
}

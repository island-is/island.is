export interface NationalRegistryResponse {
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
